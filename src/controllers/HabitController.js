import prisma from '../lib/prisma.js';

// 습관 조회
export const getTodayHabits = async (req, res) => {
  try {
    const { studyId } = req.params;

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

    const habits = await prisma.habit.findMany({
      where: {
        studyId: Number(studyId),
      },
      select: {
        id: true,
        name: true,
      },
    });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    const habitIds = habits.map((h) => h.id);

    const habitRecords = await prisma.habitRecord.findMany({
      where: {
        habitId: {
          in: habitIds,
        },
        date: {
          gte: todayStart,
          lt: tomorrowStart,
        },
      },
    });

    const completedSet = new Set(
      habitRecords.filter((r) => r.isCompleted).map((r) => r.habitId),
    );

    const result = habits.map((h) => {
      return {
        id: h.id,
        name: h.name,
        isCompleted: completedSet.has(h.id),
      };
    });

    return res.status(200).json({
      success: true,
      message: '오늘의 습관 목록 조회에 성공했습니다.',
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: '서버 내부 오류가 발생했습니다.',
      errores: [],
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
            reason: '이름은 이름은 2자 이상 20자 이하로 입력해주세요',
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

    console.log('studyId:', studyId);
    console.log('name:', name);

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
