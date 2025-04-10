import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { mediaQueryHeightMax680, mediaQueryWidthMax1280 } from '../../../styles/mediaQueries'
import { Modal, RightFooter, ButtonSecondary } from '../../generic'

const ModalBody = styled.div`
  height: 500px;

  ${mediaQueryWidthMax1280(css`
    height: 400px;
  `)};
  ${mediaQueryHeightMax680(css`
    height: 300px;
  `)}
`

const HardCoralInfoModal = ({ isModalOpen, handleCloseModal }) => {
  const mainContent = (
    <ModalBody>
      <p>
        Live coral cover maintains coral reef growth through carbonate production. Studies have
        shown that a minimum of &gt;10% hard coral cover is required for net-positive carbonate
        production. A precautionary threshold to maintain biodiversity, structural complexity and
        fisheries production is ~30% live coral cover. Analyses are currently underway to test and
        validate these thresholds. The coral cover indicator (and other indicators supported by
        MERMAID) support a Recommendation from the International Coral Reef Initiative for the
        inclusion of coral reefs and measurable indicators within the CBD Post-2020 Global
        Biodiversity Framework (
        <a target="_blank" href="https://www.icriforum.org/post2020/" rel="noopener noreferrer">
          https://www.icriforum.org/post2020/
        </a>
        ) . Measuring the national status and trends of live coral cover and other key indicators
        will support conservation and management interventions to mitigate threats and maintain
        reefs above critical functioning thresholds.
      </p>
      <h3>References:</h3>
      <p>
        {'- '}
        <a
          target="_blank"
          href="https://cdn.wcs.org/2020/08/03/38nwqd2fjr_7.31.20_CBD_Rec_2_Pager.pdf?_gl=1*1xvnuqk*_gcl_au*MTM2MTI2NjQzNC4xNzM3NTk3OTM1*_ga*MTI4Mzc1NzA3LjE3MjgyNjk4MTg.*_ga_BTX9HXMYSX*MTc0MjU3ODA0My4xOS4xLjE3NDI1NzgwNDQuNTkuMC4w"
          rel="noopener noreferrer"
        >
          WCS Policy Brief on Coral Reef Indicators
        </a>
      </p>
      <p>
        {'- '}
        Darling et al. &quot;Social–environmental drivers inform strategic management of coral reefs
        in the Anthropocene.&quot; Nature Ecology & Evolution, 2019.
      </p>
      <p>
        {'- '}
        McClanahan et al. &quot;Critical thresholds and tangible targets for ecosystem-based
        management of coral reef fisheries.&quot; PNAS, 2011.
      </p>
      <p>
        {'- '}
        McClanahan et al. &quot;Global baselines and benchmarks for fish biomass: comparing remote
        reefs and fisheries closures.&quot; MEPS, 2019
      </p>
      <p>
        {'- '}
        Perry et al. &quot;Caribbean-wide decline in carbonate production threatens coral reef
        growth&quot;. Nature Communications, 2013.
      </p>
      <p>
        {'- '}
        Perry et al. &quot;Loss of coral reef growth capacity to track future increases in sea
        level&quot;. Nature, 2018.
      </p>
    </ModalBody>
  )

  const footerContent = (
    <RightFooter>
      <ButtonSecondary onClick={handleCloseModal}>Close</ButtonSecondary>
    </RightFooter>
  )

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onDismiss={handleCloseModal}
        title={'Hard Coral Cover'}
        mainContent={mainContent}
        footerContent={footerContent}
      />
    </>
  )
}

HardCoralInfoModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  handleCloseModal: PropTypes.func.isRequired,
}

export default HardCoralInfoModal
