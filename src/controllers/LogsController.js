import prisma from '../lib/prisma.js'
import { getDateRange } from '../lib/DateRange.js'

export const getStudyLogs = async (req, res) => {
  try {
    const { studyId } = req.params;
    const { date } = req.query;

    const study = await prisma.study.findUnique({
      where: { id: Number(studyId)},
    })
    if (!study) {
      return res.status(404).json({
        success: false,
        message: "스터디를 찾을 수 없습니다.",
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
      "data": logs,
      "message": "요청이 정상적으로 처리되었습니다.",
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