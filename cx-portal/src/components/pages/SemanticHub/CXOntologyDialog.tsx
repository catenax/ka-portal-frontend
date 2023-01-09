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

import {
  Dialog,
  DialogHeader,
  DialogContent,
} from 'cx-portal-shared-components'

interface CXOntologyDialogProps {
  show: boolean
  url: string
  onClose: () => void
}

const CXOntologyDialog = ({ show, url, onClose }: CXOntologyDialogProps) => {
  return (
    <Dialog open={show} sx={{ width: '100%' }}>
      <DialogHeader
        title="CX Ontology"
        closeWithIcon
        onCloseWithIcon={onClose}
      />
      <DialogContent sx={{ pt: 1 }}>
        <iframe
          title="WebVowl"
          width="1360px"
          height={700}
          src={`https://service.tib.eu/webvowl/#url=${url}`}
        />
      </DialogContent>
    </Dialog>
  )
}

export default CXOntologyDialog
