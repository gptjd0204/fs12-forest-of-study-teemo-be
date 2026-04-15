import prisma from '../lib/prisma.js';

export const createTimer = async (req, res) => {
  try {
    const studyId = Number(req.params.studyId);

    const hasStudy = await prisma.study.findFirst({
      where: {
        id: studyId,
      },
      select: {
        id: true,
        timer: true,
      },
    });
    if (!hasStudy.id) {
      throw new Error('해당 스터디를 찾을 수 없습니다');
    }

    // 타이머가 없을 때만 생성
    if (!hasStudy.timer) {
      const timer = await prisma.timer.create({
        data: {
          studyId,
        },
      });

      return res.status(201).json({
        success: true,
        message: '타이머가 정상적으로 생성되었습니다.',
        data: {
          timer,
        },
      });
    }

    res.status(200).json({
      success: true,
      message: '이미 타이머가 생성되었습니다.',
      data: {
        timer: hasStudy.timer,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTimer = async (req, res) => {
  try {
    const studyId = Number(req.params.studyId);

    const timer = await prisma.timer.findFirst({
      where: {
        studyId,
      },
    });
    if (!timer) {
      throw new Error('해당 타이머를 찾을 수 없습니다');
    }

    res.status(200).json({
      success: true,
      message: '요청이 정상적으로 처리되었습니다.',
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

export const updateTargetDuraion = async (req, res) => {
  try {
    const studyId = Number(req.params.studyId);
    const targetDuration = Number(req.body.targetDuration);

    const timer = await prisma.timer.findFirst({
      where: {
        studyId,
      },
    });
    if (!timer) {
      throw new Error('해당 타이머를 찾을 수 없습니다');
    }
    if (timer.status === 'IN_PROGRESS') {
      throw new Error('타이머 진행중엔 수정이 불가능합니다.');
    }

    const updatedTargetDuration = await prisma.timer.update({
      where: {
        studyId,
      },
      data: {
        targetDuration,
      },
    });

    res.status(200).json({
      success: true,
      message: '목표시간이 정상적으로 업데이트 되었습니다.',
      data: {
        updatedTargetDuration,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateStart = async (req, res) => {
  try {
    const studyId = Number(req.params.studyId);
    const status = 'IN_PROGRESS';

    const timer = await prisma.timer.findFirst({
      where: {
        studyId,
      },
    });
    if (!timer) {
      throw new Error('해당 타이머를 찾을 수 없습니다');
    }
    if (timer.status === 'IN_PROGRESS') {
      throw new Error('이미 타이머가 진행중입니다.');
    }

    const startedAt = Date.now();

    const updateStatus = await prisma.timer.update({
      where: {
        studyId,
      },
      data: {
        status,
        startedAt,
      },
    });

    res.status(200).json({
      success: true,
      message: '타이머 상태가 정상적으로 업데이트 되었습니다.',
      data: {
        updateStatus,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updatePause = async (req, res) => {
  try {
    const studyId = Number(req.params.studyId);
    const status = 'PAUSED';

    const timer = await prisma.timer.findFirst({
      where: {
        studyId,
      },
    });
    if (!timer) {
      throw new Error('해당 타이머를 찾을 수 없습니다');
    }

    if (timer.status === 'CANCELED' || timer.status === 'PAUSED') {
      throw new Error('타이머가 진행중이지 않습니다.');
    }

    const now = Date.now();

    const elapsedTime = now - timer.startedAt;

    const updateStatus = await prisma.timer.update({
      where: {
        studyId,
      },
      data: {
        status,
        elapsedTime,
      },
    });

    res.status(200).json({
      success: true,
      message: '타이머 상태가 정상적으로 업데이트 되었습니다.',
      data: {
        updateStatus,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateReset = async (req, res) => {
  try {
    const studyId = Number(req.params.studyId);
    const status = 'CANCELED';

    const timer = await prisma.timer.findFirst({
      where: {
        studyId,
      },
    });
    if (!timer) {
      throw new Error('해당 타이머를 찾을 수 없습니다');
    }
    if (timer.status === 'CANCELED') {
      throw new Error('타이머가 진행중이지 않습니다.');
    }

    const updateStatus = await prisma.timer.update({
      where: {
        studyId,
      },
      data: {
        status,
        elapsedTime: 0,
      },
    });

    res.status(200).json({
      success: true,
      message: '타이머 상태가 정상적으로 업데이트 되었습니다.',
      data: {
        updateStatus,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
