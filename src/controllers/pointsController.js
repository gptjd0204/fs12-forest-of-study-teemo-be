import prisma from '../lib/prisma.js';

export const getTotalPoint = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const totalPoint = await prisma.pointLog.aggregate({
      where: {
        studyId: id,
      },
      _sum: {
        points: true,
      },
    });

    // 스터디 첫 생성 시, 포인트 로그가 없을 때
    if (!totalPoint._sum.points) {
      totalPoint._sum.points = 0;
    }

    res.status(200).json({
      success: true,
      data: { totalPoint: totalPoint._sum.points },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
