/********************************************************************************
 * Copyright (c) 2021,2022 BMW Group AG
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

import { CardItems, ImageType } from 'cx-portal-shared-components'
import { getAssetBase } from 'services/EnvironmentService'
import {
  AppMarketplaceApp,
  SubscriptionStatus,
  SubscriptionStatusItem,
  SubscriptionStatusText,
} from './apiSlice'

const baseAssets = getAssetBase()

export const getAppLeadImage = (app: AppMarketplaceApp): string => {
  if (!app.leadPictureUri || app.leadPictureUri === 'ERROR')
    return `${baseAssets}/images/apps/default/lead.png`
  if (app.leadPictureUri.startsWith('https://')) return app.leadPictureUri
  return `${baseAssets}/images/apps/${app.id}/${app.leadPictureUri}`
}

export const getAppImage = (appid: string, image: string): ImageType => ({
  text: 'image caption',
  url: image.startsWith('https://')
    ? image
    : `${baseAssets}/images/apps/${appid}/${image}`,
})

export const appToCard = (app: AppMarketplaceApp): CardItems => ({
  ...app,
  subtitle: app.provider,
  title: app.title ?? app.name, // supposed to get cleaned up to an identical key value across all the endpoints with jira ticket cplp-1700
  description: app.shortDescription === 'ERROR' ? '' : app.shortDescription,
  price: app.price === 'ERROR' ? '' : app.price,
  image: {
    src: getAppLeadImage(app),
    alt: app.title,
  },
  onClick: app.uri ? () => window.open(app.uri, '_blank')?.focus() : undefined,
})

export const filterSubscribed = (
  apps: AppMarketplaceApp[],
  subscriptionStatus: SubscriptionStatusItem[]
) => {
  if (
    !apps ||
    apps.length === 0 ||
    !subscriptionStatus ||
    subscriptionStatus.length === 0
  )
    return []
  const subscribed = subscriptionStatus
    .filter(
      (status: SubscriptionStatusItem) =>
        status.offerSubscriptionStatus === SubscriptionStatus.ACTIVE
    )
    .map((status: SubscriptionStatusItem) => status.appId)
  return apps
    .filter((app: AppMarketplaceApp) => subscribed?.includes(app.id))
    .map(appToCard)
}

export const appToStatus = (
  apps: AppMarketplaceApp[],
  subscriptionStatus: SubscriptionStatusItem[]
): AppMarketplaceApp[] => {
  return apps
    ?.map((app: AppMarketplaceApp) => {
      const status = subscriptionStatus?.find(
        (e) => e.appId === app.id
      )?.offerSubscriptionStatus
      const image = {
        src: getAppLeadImage(app),
        alt: app.title,
      }
      return { ...app, status, image }
    })
    .filter((e) => e.status)
}

export const appCardStatus = (apps: AppMarketplaceApp[]): CardItems[] => {
  if (!apps || apps.length === 0) return []
  return apps
    ?.map((app: AppMarketplaceApp) => {
      const status = app.status?.toLocaleLowerCase() as
        | SubscriptionStatus
        | undefined
      const statusText =
        SubscriptionStatusText[app.status as SubscriptionStatus] || app.status
      const title = app.name as string
      return { ...app, title, status, statusText }
    })
    .filter((e) => e.status)
    .map(appToCard)
}

export const appCardRecentlyApps = (apps: AppMarketplaceApp[]): CardItems[] => {
  if (!apps || apps.length <= 6) return []
  const recentlyData = apps
    .filter((e) => e.lastChanged)
    .map((e) => {
      const timestamp = new Date(e.lastChanged as string).getTime()
      return { ...e, timestamp }
    })
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 4)
  return appCardStatus(recentlyData)
}
