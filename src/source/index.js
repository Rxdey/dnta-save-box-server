const sourceList = [
    {
        id: 1,
        name: '漫画猫',
        apis: {
            search: {
                url: 'https://www.maofly.com/search.html?q='
            },
            detail: {
                url: 'https://www.maofly.com/manga/'
            },
            chapter: {
                url: 'https://www.maofly.com/manga/'
            }
        }
    }
]

class Source {
    constructor() {
        this.sourceList = sourceList;
    }
    get(id) {
        return this.sourceList.find(item => item.id === id);
    }
}
export default new Source();