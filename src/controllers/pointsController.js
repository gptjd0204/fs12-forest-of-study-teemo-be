import prisma from '../lib/prisma.js';

// 총합 포인트 조회
export const getTotalPoint = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const hasStudy = await prisma.study.findFirst({
      where: {
        id,
      },
    });
    if (!hasStudy) {
      res.status(404).json({
        success: false,
        message: '해당 스터디를 찾을 수 없습니다.',
        errors: [],
      });
      return;
    }

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
    res.status(500).json({
      success: false,
      message: '서버 내부 오류가 발생했습니다.',
      errors: [error.message],
    });
  }
};
