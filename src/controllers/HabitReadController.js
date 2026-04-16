import prisma from '../lib/prisma.js';
import { getDateRange, getWeekRange } from '../lib/DateRange.js';

// 습관 일일 조회
export const getTodayHabits = async (req, res) => {
  try {
    const { studyId } = req.params;

    const { start, end } = getDateRange(new Date());

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
              gte: start,
              lte: end,
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

// 습관 주간 조회
export const getWeekHabits = async (req, res) => {
  try {
    const { studyId } = req.params;

    const { start, end } = getWeekRange(new Date());

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
        startDate: {
          lte: end,
        },
        OR: [
          { endDate: null },
          {
            endDate: {
              gt: start,
            },
          },
        ],
      },
      include: {
        records: {
          where: {
            date: {
              gte: start,
              lte: end,
            },
          },
          select: {
            date: true,
            isCompleted: true,
          },
          orderBy: {
            date: 'asc',
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });

    const weeklyHabits = habits.map((h) => ({
      id: h.id,
      name: h.name,
      records: h.records,
    }));

    return res.status(200).json({
      success: true,
      message: '주간 습관 목록 조회에 성공했습니다.',
      data: {
        studyTitle: study.title,
        habits: weeklyHabits,
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
