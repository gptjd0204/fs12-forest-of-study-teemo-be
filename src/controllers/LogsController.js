import prisma from '../lib/prisma.js'
import { getDateRange } from '../lib/DateRange.js'

export const getStudyLogs = async (req, res) => {
  try {
    const { studyId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;

    if (isNaN(Number(studyId))) {
      return res.status(400).json({
        "success": false,
        "message": "유효하지 않은 스터디 ID입니다.",
        "errors": []
      });
    }

    const { date } = req.query;
    const { start, end } = getDateRange(date);

    const [totalCount, totals] = await Promise.all([
      prisma.pointLog.count({
        where: { 
          studyId: Number(studyId), 
          createdAt: { 
            gte: start,
            lte: end
          }}
      }),
      prisma.pointLog.aggregate({
        where: { 
          studyId: Number(studyId),
          createdAt: {
            gte: start,
            lte: end 
          }},
        _sum: {
          points: true,
          focusDuration: true
        }
      })
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);
    const skip = (page - 1 ) * pageSize;

    const logs = await prisma.pointLog.findMany({
      where: {
        studyId: Number(studyId),
        createdAt: {
          gte: start,
          lte: end
        }
      },
      orderBy: {createdAt: "asc"},
      skip,
      take: pageSize
    });

    return res.status(200).json({
      "success": true,
      "message": "요청이 정상적으로 처리되었습니다.",
      "data": {
        logs: logs,
        totalStats: {
          totalPoint: totals._sum.points || 0,
          totalFocus: totals._sum.focusDuration || 0
        },

        pagination: {
          currentPage: page,
          pageSize: pageSize,
          totalCount: totalCount,
          totalPages: totalPages
        }
      }
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      "success": false,
      "message": "서버 내부 오류가 발생했습니다.",
      "errors": []
    })
  }
}