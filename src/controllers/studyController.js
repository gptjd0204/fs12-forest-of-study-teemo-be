import prisma from '../lib/prisma.js';

export const getStudies = async (req, res) => {
  try {
    const studies = await prisma.study.findMany({
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

    res.status(200).json({
      success: true,
      data: studies,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* 하나의 스터디만을 반환합니다. */
export const getStudy = async (req, res) => {
  const { studyId } = req.params;
  try {
    const result = await prisma.study.findUnique({
      where: {
        studyId: Number(studyId),
      },
    });

    res.status(200).json({
      success: false,
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
