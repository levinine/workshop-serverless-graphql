const initialState = {
    currencies: [],
    error: null,
    loading: false
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'CURRENCIE_FETCH':
            return { ...state, loading: true };
        case 'CURRENCIE_FETCH_SUCCESS':
            return { ...state, currencies: action.data, loading: false };
        case 'CURRENCIE_FETCH_FAIL':
            return { ...state, error: action.error, loading: false };
        default:
            return state;
    }
};

export default reducer;
