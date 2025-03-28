import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

import { IconCheck, IconClose } from '../../../assets/icons'
import { Modal, RightFooter, ButtonSecondary, Tr, Th, Td } from '../../generic'
import { ModalStickyTable, ModalTableOverflowWrapper } from '../../generic/table'

const ModalBody = styled.div`
  padding-left: 2rem;
  padding-right: 2rem;
`

const StyledTd = styled(Td)`
  ${(props) =>
    props.$alignLeft
      ? css`
          text-align: left;
        `
      : css`
          text-align: center;
        `};
`

const StyledTh = styled(Th)`
  ${(props) =>
    props.$alignLeft
      ? css`
          text-align: left;
        `
      : css`
          text-align: center;
        `};
  ${(props) =>
    props.$width &&
    css`
      width: ${props.$width};
    `};
`

const DataSharingInfoModal = ({ isOpen, onDismiss }) => {
  const greenIconCheck = (
    <StyledTd>
      <IconCheck style={{ color: 'green' }} />
    </StyledTd>
  )
  const redIconClose = (
    <StyledTd>
      <IconClose style={{ color: 'red' }} />
    </StyledTd>
  )

  const modalContent = (
    <ModalBody>
      <ModalTableOverflowWrapper $tableCustomHeight="735px">
        <ModalStickyTable>
          <thead>
            <Tr>
              <StyledTh $width="550px" $alignLeft>
                Project-level information
              </StyledTh>
              <StyledTh>Private</StyledTh>
              <StyledTh>
                <div>Public Summary</div>
                <div>(default)</div>
              </StyledTh>
              <StyledTh>Public</StyledTh>
            </Tr>
          </thead>
          <tbody>
            <Tr>
              <Td colSpan="4">
                <strong>Contact info</strong>
              </Td>
            </Tr>
            <Tr>
              <StyledTd $alignLeft>Organization and admin names</StyledTd>
              {greenIconCheck}
              {greenIconCheck}
              {greenIconCheck}
            </Tr>
            <Tr>
              <Td colSpan="4" $alignLeft>
                <strong>Metadata</strong>
              </Td>
            </Tr>
            <Tr>
              <StyledTd $alignLeft>
                Project name and notes, country, site name and location, survey date, depth, habitat
                (reef zone, reef type and exposure), management regime name, number of transects
              </StyledTd>
              {greenIconCheck}
              {greenIconCheck}
              {greenIconCheck}
            </Tr>
            <Tr>
              <Td colSpan="4" $alignLeft>
                <strong>Site-level averages</strong>
              </Td>
            </Tr>
            <Tr>
              <StyledTd $alignLeft>Average benthic cover (%)</StyledTd>
              {redIconClose}
              {greenIconCheck}
              {greenIconCheck}
            </Tr>
            <Tr>
              <StyledTd $alignLeft>Average total reef fish biomass (kg/ha)</StyledTd>
              {redIconClose}
              {greenIconCheck}
              {greenIconCheck}
            </Tr>
            <Tr>
              <StyledTd $alignLeft>Average habitat complexity scores</StyledTd>
              {redIconClose}
              {greenIconCheck}
              {greenIconCheck}
            </Tr>
            <Tr>
              <StyledTd $alignLeft>Average colonies bleached (%)</StyledTd>
              {redIconClose}
              {greenIconCheck}
              {greenIconCheck}
            </Tr>
            <Tr>
              <Td colSpan="4" $alignLeft>
                <strong>Transect-level observations</strong>
              </Td>
            </Tr>
            <Tr>
              <StyledTd $alignLeft>Benthic observations and growth forms</StyledTd>
              {redIconClose}
              {redIconClose}
              {greenIconCheck}
            </Tr>
            <Tr>
              <StyledTd $alignLeft>
                Reef fish species, size and abundance, taxonomy and functional group information,
                biomass coefficients
              </StyledTd>
              {redIconClose}
              {redIconClose}
              {greenIconCheck}
            </Tr>
            <Tr>
              <StyledTd $alignLeft>Individual habitat complexity scores</StyledTd>
              {redIconClose}
              {redIconClose}
              {greenIconCheck}
            </Tr>
            <Tr>
              <StyledTd $alignLeft>Colonies bleached and benthic percent cover</StyledTd>
              {redIconClose}
              {redIconClose}
              {greenIconCheck}
            </Tr>
          </tbody>
        </ModalStickyTable>
      </ModalTableOverflowWrapper>
    </ModalBody>
  )
  const footerContent = (
    <RightFooter>
      <ButtonSecondary onClick={onDismiss}>Close</ButtonSecondary>
    </RightFooter>
  )

  return (
    <Modal
      title={'Data Sharing'}
      mainContent={modalContent}
      isOpen={isOpen}
      onDismiss={onDismiss}
      footerContent={footerContent}
      contentOverflowIsVisible={true}
      // modalCustomWidth={'1000px'}
    />
  )
}

DataSharingInfoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
}

export default DataSharingInfoModal
