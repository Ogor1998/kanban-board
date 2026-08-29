import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
// import DeleteComponent from '../common/DeleteComponent';
import DeleteComponent from '../reuseable/DeleteComponent';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

export default function CommentComponent({ comment, setComments }) {

    const { isLoggedIn, currentUser } = useAuth();
    const isCommentAuthor = currentUser?._id === comment.author?._id;
    const canDelete = isLoggedIn && isCommentAuthor
    console.log('this is the comments object', comment)
    const navigate = useNavigate();
    const visitProfile = () => {
        return navigate(`/profile/${comment.author?.username}`)
    }

    const handleDelete = async (id) => {
        await axios.delete(`/comments/${id}`)
        setComments(prev => prev.filter(comment => comment._id !== id))
        console.log('Frontend Deleted Comment')
    }
    return (
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', marginTop: '5px', border: '0.4px solid #000', borderRadius: '15px' }}>
            <ListItem alignItems="flex-start">
                <ListItemAvatar onClick={() => visitProfile()}>
                    <Avatar src={comment.author?.image} />
                </ListItemAvatar>
                <ListItemText
                    primary={comment.author?.username || 'anonymous'}
                    secondary={
                        <React.Fragment>
                            <Typography
                                component="span"
                                variant="body2"
                                sx={{ color: 'text.primary', display: 'inline' }}
                            >
                                {comment.content}

                            </Typography>

                        </React.Fragment>
                    }
                />
                <Typography gutterBottom variant="h1" component="div" sx={{ fontSize: '12px', alignSelf: 'center' }}>
                    {new Date(comment.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit"
                    })}
                </Typography>
                {canDelete && <DeleteComponent handleDelete={handleDelete} comment={comment} />}
                {/* <DeleteComponent handleDelete={handleDelete} comment={comment} /> */}
            </ListItem>
        </List>
    );
}
