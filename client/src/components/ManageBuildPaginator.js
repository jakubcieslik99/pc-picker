import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineChevronDoubleLeft, HiOutlineChevronDoubleRight } from 'react-icons/hi'

const ManageBuildPaginator = props => {
    const {parameters} = useSelector(state => state.listComponents)

    const history = useHistory()

    const listPagesHandler = () => {
        const limit = 6
        const pages = Math.ceil(parameters.count / limit)

        let link = `/manage-build?${props.params.id ? 'id=' + props.params.id + '&' : ''}step=${props.params.step}&searchKeyword=${props.params.searchKeyword ? props.params.searchKeyword : ''}&`

        let elements = []
        if(pages>5) {
            parameters.page>3 && elements.push(<button key={-2} onClick={() => history.push(link + 'page=1')} type="button" className="btn btn-outline-secondary">
                <HiOutlineChevronDoubleLeft/>
            </button>)
            parameters.page>1 && elements.push(<button key={-1} onClick={() => history.push(`${link}page=${parameters.page - 1}`)} type="button" className="btn btn-outline-secondary">
                <HiOutlineChevronLeft/>
            </button>)
            if(parameters.page<3) {
                for(let i=1; i<=5; i++) {
                    elements.push(<button key={i} onClick={() => history.push(`${link}page=${i}`)} type="button" className={i===parameters.page ? 'btn btn-secondary' : 'btn btn-outline-secondary'}>{i}</button>)
                }
            }
            else if(parameters.page>=3 && parameters.page<=pages - 2) {
                for(let i=parameters.page - 2; i<=parameters.page+2; i++) {
                    elements.push(<button key={i} onClick={() => history.push(`${link}page=${i}`)} type="button" className={i===parameters.page ? 'btn btn-secondary' : 'btn btn-outline-secondary'}>{i}</button>)
                }
            }
            else {
                for(let i=pages - 4; i<=pages; i++) {
                    elements.push(<button key={i} onClick={() => history.push(`${link}page=${i}`)} type="button" className={i===parameters.page ? 'btn btn-secondary' : 'btn btn-outline-secondary'}>{i}</button>)
                }
            }
            parameters.page<pages && elements.push(<button key={-3} onClick={() => history.push(`${link}page=${parameters.page + 1}`)} type="button" className="btn btn-outline-secondary">
                <HiOutlineChevronRight/>
            </button>)
            parameters.page<(pages - 2) && elements.push(<button key={-4} onClick={() => history.push(`${link}page=${pages}`)} type="button" className="btn btn-outline-secondary">
                <HiOutlineChevronDoubleRight/>
            </button>)
        }
        else {
            for(let i=1; i<=pages; i++) {
                elements.push(<button disabled={i===parameters.page ? true : false} key={i} onClick={() => history.push(`${link}page=${i}`)} type="button" className={i===parameters.page ? 'btn btn-secondary' : 'btn btn-outline-secondary'}>{i}</button>)
            }
        }

        return elements
    }

    return <div className="btn-group" role="group">
        {listPagesHandler()}
    </div>
}

export default ManageBuildPaginator
