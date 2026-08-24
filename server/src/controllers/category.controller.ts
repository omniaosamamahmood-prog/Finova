import type { Response } from "express";
import prisma from "../config/prisma.js";
import type { AuthRequest } from "../middlewares/auth.middleware.js";

export async function createCategory(
  req: AuthRequest,
  res: Response
) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { name, type } = req.body;

    // Check duplicate category
    const existingCategory = await prisma.category.findFirst({
      where: {
        userId,
        name,
        type,
      },
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await prisma.category.create({
      data: {
        name,
        type,
        userId,
      },
    });

    return res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

function unauthorized(res: Response) {
  return res.status(401).json({
    success: false,
    message: "Unauthorized",
  });
}

function notFound(res: Response) {
  return res.status(404).json({
    success: false,
    message: "Category not found",
  });
}

function handleError(res: Response, error: unknown) {
  if (error instanceof Error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
}

function getParamId(req: AuthRequest): string | null {
  const { id } = req.params;
  if (typeof id !== "string" || !id) {
    return null;
  }
  return id;
}

export async function getAllCategories(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return unauthorized(res);
    }

    const categories = await prisma.category.findMany({
      where: { userId },
      orderBy: { name: "asc" },
    });

    return res.status(200).json({ success: true, data: categories });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getCategoryById(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return unauthorized(res);
    }

    const id = getParamId(req);

    if (!id) {
      return res.status(400).json({ success: false, message: "Invalid category id" });
    }

    const category = await prisma.category.findFirst({ where: { id, userId } });

    if (!category) {
      return notFound(res);
    }

    return res.status(200).json({ success: true, data: category });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function updateCategory(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return unauthorized(res);
    }

    const id = getParamId(req);

    if (!id) {
      return res.status(400).json({ success: false, message: "Invalid category id" });
    }

    const { name, type } = req.body;

    const existing = await prisma.category.findFirst({ where: { id, userId } });

    if (!existing) {
      return notFound(res);
    }

    // Check duplicate when changing name/type
    if ((name && name !== existing.name) || (type && type !== existing.type)) {
      const duplicate = await prisma.category.findFirst({
        where: {
          userId,
          name: name ?? existing.name,
          type: type ?? existing.type,
        },
      });

      if (duplicate) {
        return res.status(400).json({ success: false, message: "Category already exists" });
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(type !== undefined && { type }),
      },
    });

    return res.status(200).json({ success: true, data: category });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function deleteCategory(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return unauthorized(res);
    }

    const id = getParamId(req);

    if (!id) {
      return res.status(400).json({ success: false, message: "Invalid category id" });
    }

    const existing = await prisma.category.findFirst({ where: { id, userId } });

    if (!existing) {
      return notFound(res);
    }

    const transactionsCount = await prisma.transaction.count({ where: { categoryId: id } });

    if (transactionsCount > 0) {
      return res.status(400).json({ success: false, message: "Cannot delete category with transactions" });
    }

    const recurringCount = await prisma.recurringTransaction.count({
      where: { categoryId: id },
    });

    if (recurringCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete category with recurring transactions",
      });
    }

    await prisma.category.delete({ where: { id } });

    return res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    return handleError(res, error);
  }
}