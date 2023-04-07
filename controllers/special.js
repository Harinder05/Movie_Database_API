exports.paginate = function paginate(results, pagenumber, itemsonpage) {
    const start = (pagenumber - 1) * itemsonpage;

    const end = start + parseInt(itemsonpage);
  
    return results.slice(start, end);
};