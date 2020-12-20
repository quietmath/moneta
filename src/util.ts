export const mapArray = (r: any[]): any[] => {
    return r.map((e: any[]) => {
        e[1].result_key = e[0];
        return e[1];
    });
};
