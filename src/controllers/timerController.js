import prisma from '../lib/prisma.js';

export const upsertTimer = async (req, res) => {
  try {
    const studyId = Number(req.body.studyId);

    const hasStudy = await prisma.study.findFirst({
      where: {
        id: studyId,
      },
    });
    if (!hasStudy) {
      throw new Error('해당 스터디를 찾을 수 없습니다');
    }

    // 타이머가 없을 때만 생성
    const timer = await prisma.timer.upsert({
      where: {
        studyId,
      },
      update: {},
      create: {
        studyId,
      },
    });

    res.status(201).json({
      success: true,
      message: '타이머가 정상적으로 생성되었습니다.',
      data: {
        timer,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
