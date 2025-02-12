import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

import { IconCheck, IconClose } from '../../../assets/icons'
import {
  Modal,
  RightFooter,
  ButtonSecondary,
  Table,
  Tr,
  Th,
  Td,
  TableOverflowWrapper,
} from '../../generic'

const StyledTd = styled(Td)`
  ${(props) =>
    props.$cellWithText
      ? css`
          text-align: left;
        `
      : css`
          text-align: center;
        `};
`

const StyledTh = styled(Th)`
  text-align: center;
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
    <TableOverflowWrapper>
      <Table>
        <thead>
          <Tr>
            <StyledTh style={{ width: '550px' }}>Project-level information</StyledTh>
            <StyledTh>Private</StyledTh>
            <StyledTh>
              <span style={{ display: 'block' }}>Public Summary</span>
              <span style={{ display: 'block' }}>(default)</span>
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
            <StyledTd $cellWithText>Organization and admin names</StyledTd>
            {greenIconCheck}
            {greenIconCheck}
            {greenIconCheck}
          </Tr>
          <Tr>
            <Td colSpan="4" $cellWithText>
              <strong>Metadata</strong>
            </Td>
          </Tr>
          <Tr>
            <StyledTd $cellWithText>
              Project name and notes, country, site name and location, survey date, depth, habitat
              (reef zone, reef type and exposure), management regime name, number of transects
            </StyledTd>
            {greenIconCheck}
            {greenIconCheck}
            {greenIconCheck}
          </Tr>
          <Tr>
            <Td colSpan="4" $cellWithText>
              <strong>Site-level averages</strong>
            </Td>
          </Tr>
          <Tr>
            <StyledTd $cellWithText>Average benthic cover (%)</StyledTd>
            {redIconClose}
            {greenIconCheck}
            {greenIconCheck}
          </Tr>
          <Tr>
            <StyledTd $cellWithText>Average total reef fish biomass (kg/ha)</StyledTd>
            {redIconClose}
            {greenIconCheck}
            {greenIconCheck}
          </Tr>
          <Tr>
            <StyledTd $cellWithText>Average habitat complexity scores</StyledTd>
            {redIconClose}
            {greenIconCheck}
            {greenIconCheck}
          </Tr>
          <Tr>
            <StyledTd $cellWithText>Average colonies bleached (%)</StyledTd>
            {redIconClose}
            {greenIconCheck}
            {greenIconCheck}
          </Tr>
          <Tr>
            <Td colSpan="4" $cellWithText>
              <strong>Transect-level observations</strong>
            </Td>
          </Tr>
          <Tr>
            <StyledTd $cellWithText>Benthic observations and growth forms</StyledTd>
            {redIconClose}
            {redIconClose}
            {greenIconCheck}
          </Tr>
          <Tr>
            <StyledTd $cellWithText>
              Reef fish species, size and abundance, taxonomy and functional group information,
              biomass coefficients
            </StyledTd>
            {redIconClose}
            {redIconClose}
            {greenIconCheck}
          </Tr>
          <Tr>
            <StyledTd $cellWithText>Individual habitat complexity scores</StyledTd>
            {redIconClose}
            {redIconClose}
            {greenIconCheck}
          </Tr>
          <Tr>
            <StyledTd $cellWithText>Colonies bleached and benthic percent cover</StyledTd>
            {redIconClose}
            {redIconClose}
            {greenIconCheck}
          </Tr>
        </tbody>
      </Table>
    </TableOverflowWrapper>
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
      modalCustomWidth={'1000px'}
    />
  )
}

DataSharingInfoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
}

export default DataSharingInfoModal
