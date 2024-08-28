const paginate = (data, page, limit) => {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedItems = data.slice(startIndex, endIndex);

    const totalPages = Math.ceil(data.length / limit);

    return {
        page,
        pageSize: limit,
        totalItems: data.length,
        totalPages,
        packs: paginatedItems,
    };
}

export default paginate;