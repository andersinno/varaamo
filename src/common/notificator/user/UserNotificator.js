import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import { firestore } from 'firebase';
import ReactHtmlWrapper from 'react-html-parser';
import classNames from 'classnames';
import orderBy from 'lodash/orderBy';
import moment from 'moment';

class UserNotificator extends Component {
  static propTypes = {
    isStaff: PropTypes.bool
  };

  state = {
    notifications: []
  };

  componentDidMount() {
    this.unsubscribeNotificationListener = firestore()
      .collection('notifications')
      .where('active', '==', true)
      .onSnapshot(this.onNotificationSnapshot);
  }

  componentWillUnmount() {
    this.unsubscribeNotificationListener && this.unsubscribeNotificationListener();
  }

  onNotificationSnapshot = (querySnap) => {
    const notifications = [];

    querySnap.forEach((doc) => {
      const notification = doc.data();
      if (moment(notification.until).isAfter()) {
        notifications.push(notification);
      }
    });
    this.setState({ notifications });
  };

  selectNotificationToShow = () => {
    const { isStaff } = this.props;
    const { notifications } = this.state;
    const sortedNotifications = orderBy(notifications, 'created');

    const notificationsForUser = sortedNotifications.filter(notification => notification.target === 'user');
    const notificationsForStaff = sortedNotifications.filter(notification => notification.target === 'staff');
    const notificationsForAll = sortedNotifications.filter(notification => notification.target === 'all');
    if (notificationsForAll.length > 0) {
      return notificationsForAll[0];
    }
    if (notificationsForStaff.length > 0 && isStaff) {
      return notificationsForStaff[0];
    }
    if (notificationsForUser.length > 0 && !isStaff) {
      return notificationsForUser[0];
    }
    return {};
  };


  closeNotificator = () => {
    this.setState(prevState => ({
      showNotificator: !prevState.showNotificator
    }));
  };

  render() {
    const notification = this.selectNotificationToShow();

    if (notification && !notification.message) return null;
    return (
      <div className={classNames('app-UserNotificator', {
        'app-UserNotificator__warning': notification.urgency === 'warning',
        'app-UserNotificator__danger': notification.urgency === 'danger'
      })}
      >
        <span className="close-notificator" onClick={this.closeNotificator}>X</span>
        <Grid className="container">
          <Row>
            <Col sm={12}>
              <span>{ ReactHtmlWrapper(notification.message) }</span>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default UserNotificator;
