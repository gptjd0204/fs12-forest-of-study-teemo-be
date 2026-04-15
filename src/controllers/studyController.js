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
      message: '요청이 정상적으로 처리되었습니다.',
      data: studies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '서버 내부 오류가 발생했습니다.',
      errors: [error.message],
    });
  }
};
