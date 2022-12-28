import articles from "./article-content";
import ArticlesList from "../components/ArticlesList";


const ArticleList = () => {
    return (
      <>
        <h1>ArticlesList</h1>
          <ArticlesList articles={articles} />
    </>
    );
}
export default ArticleList;