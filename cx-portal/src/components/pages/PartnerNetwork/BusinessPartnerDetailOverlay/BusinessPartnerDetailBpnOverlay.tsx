import React from 'react'
import { useTranslation } from 'react-i18next'
import { BpdmTypeUUIDKeyPair } from 'features/partnerNetwork/types'
import DetailGridRow from './DetailGridRow'
import { BusinessPartner } from 'features/newPartnerNetwork/types'
import GridTitle from './GridTitle'
import DialogContainer from './DailogContainer'

interface BusinessPartnerDetailOverlayProps {
  openDialog?: boolean
  selectedRowBPN: BusinessPartner
  handleOverlayClose: React.MouseEventHandler
}

const BusinessPartnerDetailBpnOverlay = ({
  openDialog = false,
  selectedRowBPN,
  handleOverlayClose,
}: BusinessPartnerDetailOverlayProps) => {
  const { t } = useTranslation()

  return (
    <div className={'business-partner-overlay'}>
      <DialogContainer
        handleOverlayClose={handleOverlayClose}
        openDialog={openDialog}
        dialogHeaderTitle={t('content.partnernetwork.overlay.title')}
      >
        <>
          <GridTitle
            title={t('content.partnernetwork.overlay.companydatatitle')}
          />
          <DetailGridRow
            key={t('content.partnernetwork.columns.name') as string}
            {...{
              variableName: `${t('content.partnernetwork.columns.name')}`,
              value: selectedRowBPN?.names ? selectedRowBPN.names[0].value : '',
            }}
          />
          <DetailGridRow
            key={t('content.partnernetwork.columns.bpn') as string}
            {...{
              variableName: `${t('content.partnernetwork.columns.bpn')}`,
              value: selectedRowBPN ? selectedRowBPN.bpn : '',
            }}
          />

          {/* {selectedRowBPN.legalForm && (
                <DetailGridRow
                  key={t('content.partnernetwork.overlay.legalform') as string}
                  {...{
                    variableName: `${t(
                      'content.partnernetwork.overlay.legalform'
                    )}`,
                    value: selectedRowBPN.legalForm,
                  }}
                />
              )} */}
          <GridTitle title={t('content.partnernetwork.columns.address')} />
          {/* <DetailGridRow
                key="Street"
                {...{ variableName: 'Street', value: selectedRowBPN.street }}
              />
              <DetailGridRow
                key="PLZ / City"
                {...{
                  variableName: 'PLZ / City',
                  value: `${selectedRowBPN.zipCode} ${selectedRowBPN.city}`,
                }}
              /> */}
          <DetailGridRow
            key="Country"
            {...{
              variableName: t('content.partnernetwork.columns.country'),
              value:
                selectedRowBPN && selectedRowBPN.legalAddress
                  ? selectedRowBPN.legalAddress.country.name
                  : '',
            }}
          />
          <GridTitle title={t('content.partnernetwork.columns.identifiers')} />
          {selectedRowBPN &&
            selectedRowBPN.identifiers?.map(
              (identifier: BpdmTypeUUIDKeyPair) => {
                return (
                  <DetailGridRow
                    key={identifier.type?.name}
                    {...{
                      variableName:
                        identifier.type?.name || identifier.type?.technicalKey,
                      value: identifier.value,
                    }}
                  />
                )
              }
            )}
        </>
      </DialogContainer>
    </div>
  )
}

export default BusinessPartnerDetailBpnOverlay
