import React from 'react'
import { screen, RenderResult } from '@testing-library/react'
import RegistrationRequests from 'components/pages/Admin/components/RegistrationRequests'
import I18nService from 'services/I18nService'
import { MockReduxStoreInitialState } from 'utils/mockDataSet/mockReduxStore'
import { renderWithStore } from 'utils/renderWithStore'
import EnglishScripts from 'assets/locales/en/main.json'

const renderRegistrationRequestsPage = (): RenderResult =>
  renderWithStore(<RegistrationRequests />, MockReduxStoreInitialState)

beforeAll(() => {
  // Fallback language is English, keep it like that and check only english scripts
  I18nService.init()
  renderRegistrationRequestsPage()
})

test('Control page is correctly rendered', async () => {
  // Check table component rendered correctly via one of the table column
  expect(
    screen.getByText(
      EnglishScripts.content.admin['registration-requests'].columns.companyinfo
    )
  ).toBeInTheDocument()
})
/*
test('Control data grid correctly filled up', async () => {
  renderRegistrationRequestsPage()

  // get first item id at mock data response
  const contentList = RegistrationRequestsMockData.content as unknown as Array<RegistrationRequest>
  const firstRequestItem = contentList[
    0
    ] as unknown as RegistrationRequest


  // Wait for page initialization and data gather
  await waitFor(() => {
    // Check id is rendered at page
    expect(screen.getByText(firstRequestItem.applicationId)).toBeInTheDocument()
  })
})
*/
