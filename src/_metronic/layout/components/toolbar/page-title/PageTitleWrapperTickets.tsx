import {useLayout} from '../../../core'
import {PageTitleTickets} from './PageTitleTickets'

const PageTitleWrapperTickets = () => {
  const {config} = useLayout()
  if (!config.app?.pageTitle?.display) {
    return null
  }

  return <PageTitleTickets />
}

export {PageTitleWrapperTickets}
