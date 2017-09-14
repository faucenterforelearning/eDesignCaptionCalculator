module.exports = (docHead)=>{
    const titleObj = docHead[0][0];

    const courseNum = titleObj['1'];
    const instructor = titleObj['2'];
    const date = titleObj['3'];

    const mdString = `# Caption Cost Breakdown
##### Instructor: ${instructor}
##### Course#: ${courseNum}
##### Date: ${date}
`;

    return {
        mdString,
        instructor,
        courseNum,
        date
    };
}