const paginate = (data, page, limit, objName) => {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedItems = data.slice(startIndex, endIndex);

    const totalPages = Math.ceil(data.length / limit);

    let obj = {
        page,
        pageSize: limit,
        totalItems: data.length,
        totalPages
    };

    obj[objName] = paginatedItems

    return obj
}

export default paginate;