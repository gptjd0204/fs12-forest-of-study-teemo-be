import prisma from '../lib/prisma.js';
import { getTodayRange } from '../lib/DateRange.js';

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

    const { start: todayStart, end: tomorrowStart } = getTodayRange();

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

    const record = await prisma.habitRecord.findFirst({
      where: {
        habitId: Number(habitId),
        date: {
          gte: todayStart,
          lt: tomorrowStart,
        },
      },
    });

    let updatedRecord;

    if (record) {
      updatedRecord = await prisma.habitRecord.update({
        where: { id: record.id },
        data: {
          isCompleted: !record.isCompleted,
        },
      });
    } else {
      updatedRecord = await prisma.habitRecord.create({
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
      data: {
        habitId: Number(habitId),
        isCompleted: updatedRecord.isCompleted,
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
