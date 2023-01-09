/********************************************************************************
 * Copyright (c) 2021,2022 T-Systems International GmbH and BMW Group AG
 * Copyright (c) 2021,2022 Contributors to the CatenaX (ng) GitHub Organisation.
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ********************************************************************************/

import { Button, Table } from 'cx-portal-shared-components'
import { fetchSemanticModels } from 'features/semanticModels/actions'
import { semanticModelsSelector } from 'features/semanticModels/slice'
import {
  FilterParams,
  SemanticModel,
  DefaultStatus,
} from 'features/semanticModels/types'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { SemanticModelTableColumns } from './SemanticModelTableColumn'
import uniqueId from 'lodash/uniqueId'
import { OntologyHubService } from '@catenax-ng/skill-modules'

interface ModelTableProps {
  onModelSelect: (id: string) => void
}

type SelectedFilter = {
  [name: string]: string[]
}

const ModelTable = ({ onModelSelect }: ModelTableProps) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { modelList, loadingModelList, deleteModelId, uploadedModel } =
    useSelector(semanticModelsSelector)
  const [models, setModels] = useState<SemanticModel[]>([])
  const [pageNumber, setPageNumber] = useState<number>(0)
  const [selectedFilter, setSelectedFilter] = useState<SelectedFilter>({
    status: [DefaultStatus],
  })
  const rowCount = 10
  const filter = [
    {
      name: 'status',
      values: [
        {
          value: DefaultStatus,
          label: 'All',
        },
        {
          value: 'RELEASED',
          label: 'Released',
        },
        {
          value: 'DRAFT',
          label: 'Draft',
        },
        {
          value: 'DEPRECATED',
          label: 'Deprecated',
        },
      ],
    },
  ]

  useEffect(() => {
    const filter = {
      page: pageNumber,
      pageSize: rowCount,
      ...(selectedFilter.status[0] !== DefaultStatus && {
        status: selectedFilter.status[0],
      }),
    }
    dispatch(fetchSemanticModels({ filter }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, pageNumber])

  useEffect(() => {
    if (deleteModelId.length > 0) {
      setModels((prevModels) =>
        prevModels.filter((model) => model.urn !== deleteModelId)
      )
    }
  }, [deleteModelId])

  useEffect(() => {
    if (uploadedModel !== null) {
      setModels((prevModels) => [uploadedModel, ...prevModels])
    }
  }, [uploadedModel])

  useEffect(() => {
    if (modelList.items.length > 0) {
      const ontologyHubService = OntologyHubService
      let rows: SemanticModel[] = []
      ontologyHubService().then((data) => {
        rows = data.map((model) => ({ ...model, urn: model.vowl }))
        rows.push(...modelList.items)
        rows.sort((a, b) => a.name.localeCompare(b.name))
        if (models.length > 0 && pageNumber > 0) {
          if (modelList.items.length > 0)
            setModels((prevModels) => prevModels.concat(rows))
        } else {
          setModels(rows)
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelList])

  const onFilterReset = () => {
    //Reset PageNumber back to 0
    dispatch(fetchSemanticModels({ filter: { page: 0, pageSize: rowCount } }))
  }

  const onSearch = (value: string) => {
    setModels([])
    const filter: FilterParams = {
      page: 0,
      pageSize: rowCount,
      namespaceFilter: value,
      ...(selectedFilter.status[0] !== DefaultStatus && {
        status: selectedFilter.status[0],
      }),
    }
    dispatch(fetchSemanticModels({ filter }))
  }

  const onFilter = (selectedFilter: any) => {
    setModels([])
    //Reset PageNumber back to 0
    setPageNumber(0)
    setSelectedFilter(selectedFilter)
    if (selectedFilter.status[0] !== DefaultStatus) {
      dispatch(
        fetchSemanticModels({
          filter: {
            page: 0,
            pageSize: rowCount,
            status: selectedFilter.status[0],
          },
        })
      )
    } else {
      onFilterReset()
    }
  }
  const columns = SemanticModelTableColumns(t, onModelSelect)

  return (
    <section>
      <Table
        rowsCount={modelList.totalItems}
        hideFooter
        loading={loadingModelList}
        disableSelectionOnClick={true}
        disableColumnFilter={true}
        disableColumnMenu={true}
        disableColumnSelector={true}
        disableDensitySelector={true}
        columnHeadersBackgroundColor={'#ffffff'}
        title={t('content.semantichub.table.title')}
        searchPlaceholder={t(
          'content.semantichub.table.searchfielddefaulttext'
        )}
        toolbarVariant="ultimate"
        toolbar={{
          onSearch: onSearch,
          onFilter: onFilter,
          filter: filter,
          selectedFilter: selectedFilter,
        }}
        columns={columns}
        rows={models}
        getRowId={(row) => uniqueId(row.urn)}
        hasBorder={false}
      />
      <div className="load-more-button-container">
        {modelList.totalPages !== pageNumber && (
          <Button
            size="medium"
            sx={{ mt: 15 }}
            onClick={() => setPageNumber((prevState) => prevState + 1)}
          >
            {t('content.semantichub.table.load_button')}
          </Button>
        )}
      </div>
    </section>
  )
}

export default ModelTable
