import prisma from '../lib/prisma.js'

const getDateRange = (date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return {start, end};
}

export const getPointLogs = async (req, res) => {
  try {
    const { studyId } = req.params;
    const { date } = req.query;

    const study = await prisma.study.findUnique({
      where: { id: Number(studyId)},
    })

    const { start, end } = getDateRange(date);

    const logs = await prisma.pointLog.findMany({
      where: {
        studyId: Number(studyId),
        createdAt: {
          // 하루치 데이터만 가져오기 위해 00:00 이상, 23:59 이하만
          // >= 이상
          gte: start,
          // <== 이하
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

export const getFocusLogs = async (req, res) => {
  try {
    const { studyId } = req.params;
    const { date} = req.query;

    const study = await prisma.study.findUnique({
      where: { id: Number(studyId)}
    });

    const {start, end} = getDateRange(date);

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
      "data": logs ?? [],
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