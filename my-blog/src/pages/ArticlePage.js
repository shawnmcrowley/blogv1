
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import CommentsList from '../components/CommentsList';
import AddCommentForm from '../components/AddCommentForm';
import useUser from '../hooks/useUser';
import articles from './article-content';
import NotFound from './NotFound';

const ArticlePage = () => {
    const [articleInfo, setArticleInfo] = useState({upvotes:0, comments:[], canUpvote: false});
    const {canUpvote} = articleInfo;
    const {articleId} = useParams(); 

    // eslint-disable-next-line
    const {user, isLoading}= useUser();
   
    useEffect(() => {
        const loadArctileInfo = async() => {
        const token = user && await user.getIdToken();
        const headers = token ? {authtoken: token} : {};
        const response = await axios.get(`/api/articles/${articleId}`, {headers});
        const newArticleInfo = response.data;                 
        setArticleInfo(newArticleInfo); 
        }
         if (!isLoading){
        loadArctileInfo();  
         }
    
          // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isLoading, user]); 

    // Pass useEffect and empty array so it only loads the first time


   
    const article = articles.find(article => article.name === articleId);
    console.log("Got Article " + articleId);

    const addUpvote = async() => {
        const token = user && await user.getIdToken();
        const headers = token ? {authtoken: token} : {};
        const response = await axios.put(`/api/articles/`+articleId+`/upvote`, null, {headers});
        //const response = await axios.put(`/api/articles/${articleId}/upvote`, null, {headers});
        console.log ("/api/articles/" +articleId +"/upvote");
        const updatedArticle = response.data;
        setArticleInfo(updatedArticle);
        
        }

    if(!article) {
        return <NotFound />
    }
    
    return (
        <>
        <h1>{article.title}</h1>
        <div className="upvotes-section">
            {user
                ? <button onClick={addUpvote}>{canUpvote ? 'UpVote' : 'Already UpVoted'}</button>
                : <button>Log In to UpVote</button>
            }
        <p>This article has {articleInfo.upvotes} vote(s) so far.</p>
        </div>
        {article.content.map((paragraph,i) => (
            <p key={i}>{paragraph}</p>
        ))} 
        {user
            ?<AddCommentForm 
            articleName={articleId}
            onArticleUpdated={updatedArticle => setArticleInfo(updatedArticle)}/>
            :<button>Log In to Add a Comment</button>
        }
        <CommentsList comments={articleInfo.comments}/>
        </>
    );
}
export default ArticlePage;