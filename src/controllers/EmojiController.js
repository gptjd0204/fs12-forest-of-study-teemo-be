import prisma from '../lib/prisma.js';

export const getEmojis = async (req, res) => {
  const { studyId } = req.params;

  try {
    const result = await prisma.emoji.findMany({
      where: {
        studyId: Number(studyId),
      },
      select: {
        id: true,
        emoji: true,
        count: true,
      },
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: '스터디를 찾을 수 없습니다.',
      });
    }

    res.status(200).json({
      success: true,
      message: '요청이 정상적으로 처리되었습니다.',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '서버 내부 오류가 발생했습니다.',
      error: error.message,
    });
  }
};

export const createEmoji = async (req, res) => {
  const { studyId } = req.params;
  const { emoji } = req.body;

  try {
    const result = await prisma.emoji.create({
      data: {
        studyId: Number(studyId),
        emoji,
      },
    });

    res.status(201).json({
      success: true,
      message: '요청이 정상적으로 처리되었습니다.',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '서버 내부 오류가 발생했습니다.',
      error: error.message,
    });
  }
};

export const updateEmoji = async (req, res) => {
  const { studyId, emojiId } = req.params;

  try {
    const emoji = await prisma.emoji.findUnique({
      where: {
        studyId: Number(studyId),
        id: Number(emojiId),
      },
    });

    if (!emoji) {
      return res.status(404).json({
        success: false,
        message: '해당 정보를 찾을 수 없습니다.',
      });
    }

    const result = await prisma.emoji.update({
      where: {
        studyId: Number(studyId),
        id: Number(emojiId),
      },
      data: {
        count: emoji.count + 1,
      },
    });

    res.status(200).json({
      success: true,
      message: '요청이 정상적으로 처리되었습니다.',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '서버 내부 오류가 발생했습니다.',
      error: error.message,
    });
  }
};
