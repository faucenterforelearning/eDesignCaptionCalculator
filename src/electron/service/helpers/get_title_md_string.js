module.exports = (docHead)=>{
    const titleObj = docHead[0][0];

    const courseNum = titleObj['1'];
    const instructor = titleObj['2'];
    //const date = titleObj['3'];
    const date = new Date().toString().substring(0, 16);

    const mdString = `# Caption Cost Estimate Breakdown
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