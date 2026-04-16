import prisma from '../lib/prisma.js';

// 디폴트 값 설정
const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 6;

//정렬 허용 값
const ALLOWED_ORDER_BY = ['latest', 'oldest', 'mostPoints', 'leastPoints'];

export const getStudies = async (req, res) => {
  try {
    const {
      keyword = '',
      orderBy = 'latest',
      page = DEFAULT_PAGE,
      pageSize = DEFAULT_PAGE_SIZE,
    } = req.query;

    const parsedPage = Number(page);
    const parsedPageSize = Number(pageSize);

    ////////////////// 400오류 //////////////////
    if (
      Number.isNaN(parsedPage) ||
      parsedPage < 1 ||
      Number.isNaN(parsedPageSize) ||
      parsedPageSize < 1
    ) {
      return res.status(400).json({
        success: false,
        message: '잘못된 요청입니다.',
        errors: ['page와 pageSize는 1 이상의 숫자여야 합니다.'],
      });
    }

    if (!ALLOWED_ORDER_BY.includes(orderBy)) {
      return res.status(400).json({
        success: false,
        message: '잘못된 요청입니다.',
        errors: [
          'orderBy는 latest, oldest, mostPoints, leastPoints 중 하나여야 합니다.',
        ],
      });
    }

    ////////////////// 검색 //////////////////
    //mode: 'insensitive' 대소문자 구분 하지 않음
    //키워드 있으면 타이틀이나 닉네임에서 검색, 없으면 전체 반환
    const where = keyword
      ? {
          OR: [
            { title: { contains: keyword, mode: 'insensitive' } },
            { nickname: { contains: keyword, mode: 'insensitive' } },
          ],
        }
      : {};

    //프론트 보낼 데이터 select (password 포함하지 않았음. 추후에 수정 필요하면 변경하겠음)
    const studies = await prisma.study.findMany({
      where,
      select: {
        id: true,
        nickname: true,
        title: true,
        description: true,
        background: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    ////////////////// 포인트 정렬 //////////////////
    const studyIds = studies.map((study) => study.id);

    /* const pointSums = [
      { studyId: 10, _sum: { points: 25 } },
      { studyId: 15, _sum: { points: 10 } }
    ]; */
    const pointSums =
      studyIds.length > 0
        ? await prisma.pointLog.groupBy({
            by: ['studyId'],
            where: {
              studyId: {
                in: studyIds, // 현재 조회된 스터디 id에 해당하는 pointLog만 가져옴
              },
            },
            _sum: {
              points: true, // 그룹별 포인트 합계 계산
            },
          })
        : [];

    /* 위에 pointSums를 그대로 두면 포인트를 찾을 때마다
    pointSums.find((item) => item.studyId === study.id)과정이 필요함
    [
      [10, 25],
      [15, 10]
    ]*/
    const pointMap = new Map(
      pointSums.map((item) => [item.studyId, item._sum.points ?? 0]),
    );

    //스터디+총 포인트 새로운 배열 만듦
    const studiesWithPoints = studies.map((study) => ({
      ...study,
      totalPoint: pointMap.get(study.id) ?? 0,
    }));

    const sortedStudies = [...studiesWithPoints].sort((a, b) => {
      //오래된 순
      if (orderBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }

      //포인트 많은 순
      if (orderBy === 'mostPoints') {
        if (b.totalPoint !== a.totalPoint) {
          return b.totalPoint - a.totalPoint;
        }

        return new Date(b.createdAt) - new Date(a.createdAt);
      }

      //포인트 적은 순
      if (orderBy === 'leastPoints') {
        if (a.totalPoint !== b.totalPoint) {
          return a.totalPoint - b.totalPoint;
        }

        return new Date(b.createdAt) - new Date(a.createdAt);
      }

      //최근 순
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    ////////////////// 페이지네이션 //////////////////
    /*
        totalCount : 정렬까지 끝난 전체 스터디 개수
        totalPages : 전체개수 / pagesize
        skip : 현재 페이지에서 앞쪽 몇 개 건너뛸지 계산
        paginatedStudies : 해당 구간만 잘라내기
    */
    const totalCount = sortedStudies.length;
    const totalPages = Math.ceil(totalCount / parsedPageSize);
    const skip = (parsedPage - 1) * parsedPageSize;
    const paginatedStudies = sortedStudies.slice(skip, skip + parsedPageSize);

    ////////////////// 응답 //////////////////
    return res.status(200).json({
      success: true,
      message: '요청이 정상적으로 처리되었습니다.',
      data: {
        studies: paginatedStudies,
        pagination: {
          currentPage: parsedPage,
          pageSize: parsedPageSize,
          totalCount,
          totalPages,
        },
        filters: {
          keyword,
          orderBy,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: '서버 내부 오류가 발생했습니다.',
      errors: [error.message],
    });
  }
};

/* 하나의 스터디만을 반환합니다. */
export const getStudy = async (req, res) => {
  const { studyId } = req.params;
  try {
    const result = await prisma.study.findUnique({
      where: {
        id: Number(studyId),
      },
    });

    res.status(200).json({
      success: true,
      message: '데이터가 성공적으로 로드되었습니다.',
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const createStudy = async (req, res) => {
  try {
    const { nickname, title, description, background, password } = req.body;

    const errors = {};

    if (!nickname?.trim()) {
      errors.nickname = '닉네임을 입력해주세요.';
    }

    if (!title?.trim()) {
      errors.title = '제목을 입력해주세요.';
    }

    if (!background?.trim()) {
      errors.background = '배경을 선택해주세요.';
    }

    if (!password?.trim()) {
      errors.password = '비밀번호를 입력해주세요.';
    }

    if (password?.trim()) {
      if (password.length < 8 || password.length > 20) {
        errors.password = '비밀번호는 8자 이상 20자 이하로 입력해주세요.';
      } else if (/\s/.test(password)) {
        errors.password = '비밀번호에 공백은 사용할 수 없습니다.';
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: '잘못된 요청입니다.',
        errors,
      });
    }

    const result = await prisma.study.create({
      data: {
        nickname,
        title,
        description,
        background,
        password,
      },
      select: {
        id: true,
        nickname: true,
        title: true,
        description: true,
        background: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: '리소스가 정상적으로 생성되었습니다.',
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: '서버 내부 오류가 발생했습니다.',
      errors: {
        server: error.message,
      },
    });
  }
};
