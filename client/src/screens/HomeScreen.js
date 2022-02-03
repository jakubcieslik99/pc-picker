import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import queryString from 'query-string'
import { listConfigsAction, listConfigsErrorReset } from '../actions/configActions'
import { Container } from 'react-bootstrap'
import HomeBuild from '../components/HomeBuild'
import HomeScreenPaginator from '../components/HomeScreenPaginator'

const HomeScreen = props => {
    const {loading, configs, parameters, error} = useSelector(state => state.listConfigs)

    const [searchKeyword, setSearchKeyword] = useState('')

    const dispatch = useDispatch()
    const history = useHistory()
    const params = queryString.parse(props.location.search)

    useEffect(() => {
        if(error) dispatch(listConfigsErrorReset())

        let data = {
            searchKeyword: '',
            sortOrder: '',
            page: 1
        }
        if(params.searchKeyword && params.searchKeyword!=='undefined') data.searchKeyword = params.searchKeyword
        else setSearchKeyword('')
        if(params.sortOrder && params.sortOrder!=='undefined') data.sortOrder = params.sortOrder
        if(params.page && params.page!=='undefined') data.page = parseInt(params.page)

        dispatch(listConfigsAction(data.searchKeyword, data.sortOrder, data.page))

        return () => {}
    }, [dispatch, props.location.search, props.history]) // eslint-disable-line react-hooks/exhaustive-deps

    const searchHandler = event => {
        event.preventDefault()
        history.push('/?searchKeyword=' + searchKeyword + '&sortOrder=' + (params.sortOrder ? params.sortOrder : ''))
    }
    const searchHandlerEnter = event => {
        event.key==='Enter' && history.push('/?searchKeyword=' + searchKeyword + '&sortOrder=' + (params.sortOrder ? params.sortOrder : ''))
    }

    const clearSearchHandler = event => {
        event.preventDefault()
        setSearchKeyword('')
        history.push('/?searchKeyword=&sortOrder=' + (params.sortOrder ? params.sortOrder : ''))
    }

    const sortHandler = event => {
        history.push('/?searchKeyword=' + (params.searchKeyword ? params.searchKeyword : '') + '&sortOrder=' + event.target.value)
    }

    return <Container id="screen" className="">
        <div className="row">
            <div className="col-lg-5">
                <h3 className="mb-3 mb-lg-2">Znajdź swój zestaw komputerowy!</h3>
            </div>

            <div className="col-lg-4 d-flex justify-content-start justify-content-sm-end">
                <div className="mb-3 mb-lg-2 input-group">
                    {searchKeyword && <button onClick={clearSearchHandler} type="button" className="btn btn-dark">X</button>}
                    <input onKeyDown={!loading && searchKeyword ? searchHandlerEnter : undefined} value={searchKeyword} name="searchKeyword" type="text" className="form-control" placeholder="Wyszukaj komponent w zestawie" onChange={e => setSearchKeyword(e.target.value)}/>
                    <button onClick={!loading && searchKeyword ? searchHandler : undefined} type="button" className="btn btn-dark">Szukaj</button>
                </div>
            </div>

            <div className="col-lg-3">
                <select onChange={sortHandler} value={params.sortOrder} className="mb-2 form-select" name="sortOrder">
                    <option value="">Sortuj od najnowszych</option>
                    <option value="date_oldest">Sortuj od najstarszych</option>
                </select>
            </div>
        </div>

        <div className="row">
            {error ? <div className="pt-3 pb-1 text-center">{error}</div> : 
            loading ?  <div className="pt-3 pb-1 text-center">Ładowanie...</div> : 
            !configs || configs.length===0 ? <div className="pt-3 pb-1 text-center">Brak konfiguracji.</div> : 
            configs && configs.map(config => <HomeBuild key={config.id} config={config}/>)}
        </div>

        <div className="mt-3 d-flex justify-content-center">
            {configs && configs.length>0 && parameters && <HomeScreenPaginator params={params}/>}
        </div>
    </Container>
}

export default HomeScreen
