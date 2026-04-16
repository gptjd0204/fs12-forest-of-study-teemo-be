import prisma from '../lib/prisma.js'
import { getDateRange } from '../lib/DateRange.js'

export const getStudyLogs = async (req, res) => {
  try {
    const { studyId } = req.params;

    if (isNaN(Number(studyId))) {
      return res.status(400).json({
        "success": false,
        "message": "유효하지 않은 스터디 ID입니다.",
        "errors": []
      });
    }

    const { date } = req.query;

    const study = await prisma.study.findUnique({
      where: { id: Number(studyId)},
    })
    if (!study) {
      return res.status(404).json({
        "success": false,
        "message": "스터디를 찾을 수 없습니다.",
        "errors": [],
      });
    }
    const { start, end } = getDateRange(date);

    const logs = await prisma.pointLog.findMany({
      where: {
        studyId: Number(studyId),
        createdAt: {
          gte: start,
          lte: end,
        }
      },
      orderBy: {
        createdAt: "asc",
      }
    })

    return res.status(200).json({
      "success": true,
      "message": "요청이 정상적으로 처리되었습니다.",
      "data": logs,
    })
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      "success": false,
      "message": "서버 내부 오류가 발생했습니다.",
      "errors": []
    })
  }
}