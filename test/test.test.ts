test('test test itself', () => {
    expect(1).toBe(1);
    let listone = [1, 2, 3];
    let listtwo = [1, 2, 3];
    expect(listone.length).toEqual(listtwo.length);
    expect(listone).toHaveLength(3);
});
