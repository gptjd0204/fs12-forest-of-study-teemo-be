import prisma from '../lib/prisma.js';

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

    console.log('todayStart:', todayStart);
    console.log('tomorrowStart:', tomorrowStart);
    console.log('habitIds:', habitIds);
    console.log('habitRecords:', habitRecords);

    const completedSet = new Set(
      habitRecords.filter((r) => r.isCompleted).map((r) => r.habitId),
    );

    console.log('completedSet:', completedSet);

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
