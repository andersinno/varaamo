import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import PageWrapper from '../PageWrapper';
import injectT from '../../i18n/injectT';
import client from '../../../src/common/api/client';
import { translateItem } from '../../state/selectors/translationSelectors';
import adminGuidePageSelector from './AdminGuidePageSelector';

class UnconnectedAdminGuidePage extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    currentLanguage: PropTypes.string.isRequired,
  };

  state = {
    instructions: [],
  };

  componentDidMount() {
    this.fetchAndSetInstructions();
  }

  fetchInstructions = async () => {
    const response = await client.get('admin_instructions');
    const instructions = response.data.results;
    return instructions;
  };

  fetchAndSetInstructions = async () => {
    try {
      const instructions = await this.fetchInstructions();
      const { currentLanguage } = this.props;
      const translatedInstructions = instructions.map(item => translateItem(item, currentLanguage));
      this.setState({ instructions: translatedInstructions });
    } catch (error) {
      this.setState({ instructions: [] });
    }
  };

  render() {
    const { t } = this.props;
    const { instructions } = this.state;
    return (
      <PageWrapper className="admin-guide-page" title={t('AdminGuidePage.title')}>
        {instructions.map(instruction => (
          <div
            className="app-adminGuidePage__instructions"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: instruction.content }}
            key={instruction.id}
          />
        ))}
      </PageWrapper>
    );
  }
}

UnconnectedAdminGuidePage = injectT(UnconnectedAdminGuidePage);  // eslint-disable-line

export { UnconnectedAdminGuidePage };
export default connect(
  adminGuidePageSelector,
  {},
)(UnconnectedAdminGuidePage);
