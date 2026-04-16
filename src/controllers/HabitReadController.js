import prisma from '../lib/prisma.js';
import { getTodayRange } from '../lib/DateRange.js';

// 습관 조회
export const getTodayHabits = async (req, res) => {
  try {
    const { studyId } = req.params;

    const { start: todayStart, end: tomorrowStart } = getTodayRange();

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
