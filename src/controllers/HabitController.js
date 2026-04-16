import prisma from '../lib/prisma.js';

// 습관 조회
export const getTodayHabits = async (req, res) => {
  try {
    const { studyId } = req.params;

    const study = await prisma.study.findUnique({
      where: {
        id: Number(studyId),
      },
      select: {
        title: true,
      },
    });

    if (!study) {
      return res.status(404).json({
        success: false,
        message: '스터디를 찾을 수 없습니다.',
        errors: [],
      });
    }
    // today 추후 toggleHabit 파트랑 뭉쳐서 빼버리기
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    const habits = await prisma.habit.findMany({
      where: {
        studyId: Number(studyId),
      },
      include: {
        records: {
          where: {
            date: {
              gte: todayStart,
              lt: tomorrowStart,
            },
          },
          select: {
            isCompleted: true,
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });

    const habitIds = habits.map((h) => ({
      id: h.id,
      name: h.name,
      isCompleted: h.records[0]?.isCompleted ?? false,
    }));

    return res.status(200).json({
      success: true,
      message: '오늘의 습관 목록 조회에 성공했습니다.',
      data: {
        studyTitle: study.title,
        habits: habitIds,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: '서버 내부 오류가 발생했습니다.',
      errors: [],
    });
  }
};

// 습관 생성
export const createHabit = async (req, res) => {
  try {
    const { studyId } = req.params;

    const { name } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: '잘못된 요청입니다.',
        errors: [
          {
            field: 'name',
            reason: '이름은 필수 입력값입니다.',
          },
        ],
      });
    }

    if (name.trim().length < 2 || name.trim().length > 20) {
      return res.status(400).json({
        success: false,
        message: '잘못된 요청입니다.',
        errors: [
          {
            field: 'name',
            reason: '이름은 2자 이상 20자 이하로 입력해주세요',
          },
        ],
      });
    }

    const study = await prisma.study.findUnique({
      where: {
        id: Number(studyId),
      },
    });

    if (!study) {
      return res.status(404).json({
        success: false,
        message: '스터디를 찾을 수 없습니다.',
        errors: [],
      });
    }

    const habit = await prisma.habit.create({
      data: {
        studyId: Number(studyId),
        name: name.trim(),
        startDate: new Date(),
      },
    });

    return res.status(201).json({
      success: true,
      message: '습관이 생성되었습니다.',
      data: {
        habit,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: '서버 내부 오류가 발생했습니다.',
      errors: [],
    });
  }
};

// 습관 토글
export const toggleHabit = async (req, res) => {
  try {
    const { studyId, habitId } = req.params;

    const habit = await prisma.habit.findFirst({
      where: {
        id: Number(habitId),
        studyId: Number(studyId),
      },
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: '습관을 찾을 수 없습니다.',
        errors: [],
      });
    }

    // 추후 조회 API 내 today ~ 와 함께 빼기
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    const record = await prisma.habitRecord.findFirst({
      where: {
        habitId: Number(habitId),
        date: {
          gte: todayStart,
          lt: tomorrowStart,
        },
      },
    });

    if (record) {
      await prisma.habitRecord.update({
        where: { id: record.id },
        data: {
          isCompleted: !record.isCompleted,
        },
      });
    } else {
      await prisma.habitRecord.create({
        data: {
          habitId: Number(habitId),
          date: todayStart,
          isCompleted: true,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: '습관 완료 상태가 변경되었습니다.',
      data: {},
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: '서버 내부 오류가 발생했습니다.',
      errors: [],
    });
  }
};
