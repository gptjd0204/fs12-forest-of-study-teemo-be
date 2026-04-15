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
      data: studies,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const createStudy = async (req, res) => {
  try {
    const { nickname, title, description, background, password } = req.body;

    if (
      !nickname?.trim() ||
      !title?.trim() ||
      !background?.trim() ||
      !password?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: '잘못된 요청입니다',
        data: null,
      });
    }

    if (password.length < 8 || password.length > 20) {
      return res.status(400).json({
        success: false,
        message: '비밀번호는 8자 이상 20자 이하로 입력해주세요.',
      });
    }

    if (/\s/.test(password)) {
      return res.status(400).json({
        success: false,
        message: '비밀번호에 공백은 사용할 수 없습니다.',
      });
    }

    const result = await prisma.study.create({
      data: {
        nickname,
        title,
        description,
        background,
        password,
      },
      select: {
        id: true,
        nickname: true,
        title: true,
        description: true,
        background: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: '리소스가 정상적으로 생성되었습니다.',
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: '서버 내부 오류가 발생했습니다.',
      errors: [error.message],
    });
  }
};
