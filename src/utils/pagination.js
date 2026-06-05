export const getPagination = (query, defaults = {}) => {
    const page = Math.max(parseInt(query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(query.limit, 10) || defaults.limit || 12, 50);
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy || defaults.sortBy || "createdAt";
    const sortOrder = query.sortOrder === "asc" ? 1 : -1;

    return { page, limit, skip, sort: { [sortBy]: sortOrder } };
};
