import client from '../../index'
import { GET_CURRENCIES } from '../../queries'

export const loadCurrencies = () => async dispatch => {
    dispatch(currencieFetch());
    try {
        const result = await client.query({
            query: GET_CURRENCIES,
        });
        console.log(result.data);
        dispatch(currencieFetchSuccess(result.data));
    } catch (error) {
        dispatch(currencieFetchFail(error));
    }
};

const currencieFetch = () => ({
    type: 'CURRENCIE_FETCH'
});

const currencieFetchSuccess = data => ({
    type: 'CURRENCIE_FETCH_SUCCESS',
    data
});

const currencieFetchFail = error => ({
    type: 'CURRENCIE_FETCH_FAIL',
    error
});
