import React from 'react'
import List from '@material-ui/core/List'
import IconButton from '@material-ui/core/IconButton'
import CssBaseline from '@material-ui/core/CssBaseline'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import ButtonGroup from '@material-ui/core/ButtonGroup'

import Divider from '@material-ui/core/Divider'
import ShareIcon from '@material-ui/icons/Share'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { makeStyles } from '@material-ui/core/styles'
import grey from '@material-ui/core/colors/grey'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Notification from './Notification'
import Copyright from './Copyrights'

import validator from '../services/validator'
import questionActions from '../actions/questionAction'
import {
  setEditedQuestionContent,
  setEditedQuestionContentHelperText,
  setEditedQuestionTags,
  setEditedQuestionTagsHelperText,
  setEditedQuestionTitle,
  setEditedQuestionTitleHelperText,
} from '../actions/questionActions'
import Comment from './PartialViews/Comment'
import QuestionIcons from './PartialViews/QuestionIcons'
import UpvoteBox from './PartialViews/UpvoteBox'
import utils from '../services/utils'

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    position: 'relative',
    minHeight: '100vh',
    height: '100%',
  },

  mainContainer: {
    backgroundColor: grey[100],
  },

  root: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    overflow: 'hidden',
    paddingTop: 16,
    height: '100%',
    marginBottom: '4rem',
    paddingBottom: 32,
    width: '100%',
  },

  questionContent: {
    width: '90%',
  },

  paper: {
    width: '90%',
    margin: 2,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    displayDirection: 'column',
  },

  font: {
    [theme.breakpoints.between('lg', 'xl')]: {
      fontSize: '1.4rem',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '1.2rem',
    },
  },

}))

const QuestionView = ({
  user, state, dispatch, handleDeleteQuestion, handleQuestionUpdate,
  handleDeleteComment, handleUpvoteQuestion, handleDownvoteQuestion,
  handleUpvoteComment, handleDownvoteComment, handleCommentPost,
}) => {
  const classes = useStyles()
  const {
    question, editedQuestionTags, editedQuestionContent, editedQuestionTitle,
    errorMessage, showEditFields, editedQuestionContentHelperText,
    editedQuestionTagsHelperText, editedQuestionTitleHelperText,
    commentContent,
  } = state
  const isMobile = useMediaQuery('(max-width:600px)')
  const isLowResolution = useMediaQuery('(max-width:800px)')

  /**
   * wrappers for useState setter functions
   * */
  const setCommentContent = (commentContent) => {
    dispatch({
      type: questionActions.SET_COMMENT_CONTENT,
      commentContent,
    })
  }

  const setShowEditFields = (showEditFields) => {
    dispatch({
      type: questionActions.SET_SHOW_EDIT_FIELDS,
      showEditFields,
    })
  }

  /**
   * Updates editedQuestionTitle to user input, validates the title
   * Updates editedTitleHelperText to an error message if validation fails,
   * otherwise it will be an empty string
   *
   * @param event, react onChange event used to get the value of the textfield
   * */
  const handleEditedTitle = (event) => {
    dispatch(setEditedQuestionTitle(event.target.value))
    dispatch(setEditedQuestionTitleHelperText(''))

    if (!validator.questionFormValidator({ title: state.editedQuestionTitle })) {
      dispatch(setEditedQuestionTitleHelperText('title must be 6 characters long at least and 64 at most'))
    }
  }

  /**
   * Updates editedQuestionContent to user input, validates the title
   * Updates editedQuestionContentHelperText to an error message if validation fails,
   * otherwise it will be an empty string
   *
   * @param event, react onChange event used to get the value of the textfield
   * */
  const handleEditedContent = (event) => {
    dispatch(setEditedQuestionContent(event.target.value))
    dispatch(setEditedQuestionContentHelperText(''))

    if (!validator.questionFormValidator({ content: state.editedQuestionContent })) {
      dispatch(setEditedQuestionContentHelperText('content must be at least 8 characters long'))
    }
  }

  /**
   * Updates editedQuestionTags to user input, validates the title
   * Updates editedQuestionTagsHelperText to an error message if validation fails,
   * otherwise it will be an empty string
   *
   * @param event, react onChange event used to get the value of the textfield
   * */
  const handleEditedTags = (event) => {
    const tags = event.target.value
    dispatch(setEditedQuestionTags(tags))
    dispatch(setEditedQuestionTagsHelperText(''))

    if (!validator.questionFormValidator({ tags })) {
      dispatch(setEditedQuestionTagsHelperText('tags must be words, separated by space, like in "hello world"'))
    }
  }

  const questionLikes = utils.getLikes(question)

  return (
    <div className={classes.mainContainer} data-testid="question-container">
      <Notification title="Error" message={errorMessage} severity="error" />
      <div className={classes.container}>
        <div
          className={classes.root}
          style={{
            paddingBottom: '3 rem',
          }}
        >
          <CssBaseline />
          <Paper
            className={classes.paper}
            elevation={2}
            style={{
              marginBottom: 32,
              marginTop: 0,
            }}
          >
            <Grid container justify="space-between" direction="column">
              <Grid container justify="space-between">
                {showEditFields
                  ? (
                    <Grid container justify="space-between">
                      <TextField
                        helperText={editedQuestionTitleHelperText}
                        error={editedQuestionTitleHelperText.length > 0}
                        id="title"
                        label="Title"
                        variant="outlined"
                        value={editedQuestionTitle}
                        onChange={handleEditedTitle}
                        style={{
                          width: '70%',
                          margin: 8,
                        }}
                        inputProps={{
                          'data-testid': 'title-input',
                        }}
                      />
                      {!isMobile ? (
                        <QuestionIcons
                          direction="row"
                          handleDelete={() => handleDeleteQuestion(question.id)}
                          handleEdit={() => setShowEditFields(!showEditFields)}
                          handleUpdate={handleQuestionUpdate}
                          path={`question/${question.id}`}
                        />
                      ) : ''}
                    </Grid>
                  )
                  : (
                    <Grid container justify="space-between" alignContent="center">
                      <Grid
                        container
                        justify="center"
                        direction="column"
                        style={{
                          marginLeft: 20,
                          width: isMobile ? '100%' : '68%',
                        }}
                      >
                        <Typography
                          variant="h5"
                          align="left"
                          className={classes.font}
                          style={{
                            width: '80%',
                            overflowWrap: 'break-word',
                          }}
                          data-testid="title"
                        >
                          {question.title}
                        </Typography>
                      </Grid>

                      <Grid
                        item
                        style={{
                          marginTop: 8,
                          marginRight: '1%',
                        }}
                      >
                        {utils.iff(validator.isAuthor(user, question) && !isMobile, <QuestionIcons
                          direction="row"
                          handleDelete={() => handleDeleteQuestion(question.id)}
                          handleEdit={() => setShowEditFields(!showEditFields)}
                          handleUpdate={handleQuestionUpdate}
                          path={`question/${question.id}`}
                        />, utils.iff(!isMobile,
                          <div
                            edge="end"
                            aria-label="icons"
                            style={{
                              width: '100%',
                              display: 'flex',
                              justifyContent: isMobile ? 'flex-start' : 'flex-end',
                              flexDirection: isMobile ? 'column' : 'row',
                            }}
                          >
                            <CopyToClipboard text={window.location.href}>
                              <IconButton size="small">
                                <ShareIcon />
                              </IconButton>
                            </CopyToClipboard>
                          </div>, ''))}

                      </Grid>
                    </Grid>
                  )}

              </Grid>
              <Divider style={{
                width: '96%',
                margin: '0 auto',
                marginTop: isMobile ? 0 : 8,
                marginBottom: showEditFields ? 20 : 8,
              }}
              />
              <Grid container>
                {showEditFields ? '' : (
                  <UpvoteBox
                    handleUpvote={() => handleUpvoteQuestion(question.id)}
                    handleDownvote={() => handleDownvoteQuestion(question.id)}
                    likes={questionLikes}
                  />
                )}
                <Grid
                  item
                  style={{
                    marginRight: 8,
                    width: utils.iff(isMobile, (showEditFields ? '100%' : '78%'), (isLowResolution ? '78%' : '90%')),
                  }}
                >
                  {showEditFields
                    ? (
                      <TextField
                        helperText={editedQuestionContentHelperText}
                        error={editedQuestionContentHelperText.length > 0}
                        id="content"
                        label="Content"
                        variant="outlined"
                        value={editedQuestionContent}
                        multiline
                        rows={3}
                        rowsMax={8}
                        fullWidth
                        onChange={handleEditedContent}
                        style={{
                          width: '90%',
                          marginLeft: 8,
                        }}
                        inputProps={{
                          'data-testid': 'content-input',
                        }}
                      />
                    )
                    : (
                      <Grid
                        item
                        style={{
                          width: isMobile ? '100%' : '90%',
                        }}
                      >
                        <Typography
                          variant="body1"
                          className={classes.questionContent}
                          display="block"
                          paragraph
                          key={question.content}
                          gutterBottom
                          align="left"
                          style={{
                            overflowWrap: 'break-word',
                            width: '100%',
                          }}
                          data-testid="content"
                        >
                          {question.content}
                        </Typography>

                      </Grid>
                    )}

                </Grid>

                <Grid
                  item
                  style={{
                    position: 'relative',
                    top: '50%',
                    marginRight: 16,
                  }}
                />

              </Grid>

              <Grid
                item
                style={{
                  position: 'relative',
                  marginTop: 16,
                  width: '100%',
                }}
              >
                {showEditFields
                  ? (
                    <TextField
                      helperText={editedQuestionTagsHelperText}
                      error={editedQuestionTagsHelperText.length > 0}
                      id="tags"
                      label="Tags"
                      variant="outlined"
                      value={editedQuestionTags}
                      onChange={handleEditedTags}
                      style={{
                        width: '90%',
                        margin: 8,
                        marginBottom: 26,
                      }}
                      inputProps={{
                        'data-testid': 'tags-input',
                      }}
                    />
                  )
                  : ''}
                {utils.iff(isMobile, utils.iff(validator.isAuthor(user, question),
                  <QuestionIcons
                    direction="row"
                    handleDelete={() => handleDeleteQuestion(question.id)}
                    handleEdit={() => setShowEditFields(!showEditFields)}
                    handleUpdate={handleQuestionUpdate}
                    path={`question/${question.id}`}
                  />,
                  <div
                    edge="end"
                    aria-label="icons"
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'flex-start',
                      backgroundColor: grey[200],
                    }}
                  >
                    <CopyToClipboard text={window.location.href}>
                      <IconButton size="small">
                        <ShareIcon />
                      </IconButton>
                    </CopyToClipboard>
                  </div>),
                (!showEditFields && question && question.tags && question.tags.length > 0)
                  && (
                    <ButtonGroup
                      size="small"
                      aria-label="small outlined button group"
                      style={{
                        marginBottom: 6,
                        marginLeft: 18,
                      }}
                    >
                      {question && question.tags && question.tags.map((tag) => (
                        <Button
                          key={tag}
                          style={{
                            maxHeight: '20px',
                            minWidth: '60px',
                            minHeight: '20px',
                            fontSize: 10,
                          }}
                        >
                          {tag}
                        </Button>
                      ))}
                    </ButtonGroup>
                  ))}

                <Typography
                  variant="caption"
                  style={{
                    color: 'grey',
                    marginRight: 8,
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    marginBottom: 2,
                  }}
                >
                  posted by:
                  {' '}
                  {question && question.postedBy && question.postedBy.username}
                </Typography>
              </Grid>

            </Grid>
          </Paper>

          <List style={{
            width: '90%',
          }}
          >
            {question && question.comments && question.comments.map((comment) => (
              <div
                style={{
                  marginTop: 8,
                }}
                key={comment.content}
              >
                <Comment
                  user={user}
                  comment={comment}
                  handleUpvote={() => handleUpvoteComment(comment)}
                  handleDownVote={() => handleDownvoteComment(comment)}
                  handleDelete={() => handleDeleteComment(comment.id)}
                />
              </div>
            ))}
            {user ? (
              <Grid
                container
                justify="center"
                style={{
                  marginTop: 32,
                }}
              >
                <Grid container direction="column" justify="center" className={classes.paper}>
                  <TextField
                    placeholder="Add a comment"
                    multiline
                    rows={3}
                    rowsMax={8}
                    fullWidth
                    variant="outlined"
                    value={commentContent}
                    onChange={(event) => setCommentContent(event.target.value)}
                  />
                  <Grid
                    container
                    justify="flex-end"
                    style={{
                      marginTop: 8,
                    }}
                  >
                    <Button
                      variant="outlined"
                      onClick={() => setCommentContent('')}
                    >
                      clear
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleCommentPost}
                      style={{
                        marginLeft: 8,
                      }}
                    >
                      submit
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            ) : ''}
          </List>
        </div>
        <Copyright />
      </div>
    </div>
  )
}

export default QuestionView
