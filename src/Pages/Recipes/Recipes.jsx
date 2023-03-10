import React, { useState } from 'react';
import { useGetAllRecipeQuery } from '../../Features/recipe/recipeApi';
import MainLayout from './../../Components/Layout/MainLayout/MainLayout';
import { useLocation, useSearchParams } from 'react-router-dom';
import style from './style.module.css';
import Swal from 'sweetalert2';
import CardRecipe from '../../Components/Cards/CardRecipe/CardRecipe';

const Recipes = () => {
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [utils, setUtils] = useState({
    search: searchParams.get('search'),
    page: searchParams.get('page'),
    limit: searchParams.get('limit'),
    sortBy: searchParams.get('sortBy'),
    sort: searchParams.get('sort') || 'desc',
  });

  const { data: recipes, isLoading } = useGetAllRecipeQuery({ search: utils.search, page: utils.page, limit: utils.limit, sortBy: utils.sortBy, sort: utils.sort });

  function showLoading() {
    Swal.fire({
      title: 'Loading...',
      html: 'Please wait...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }

  function generatePagination() {
    let btn = [];

    for (let i = 1; i <= recipes?.pagination?.totalPage; i++) {
      btn.push(
        <button key={i} className={`btn btn-transparent ${recipes?.pagination?.currentPage == i ? 'bg-secondary' : ''} text-light`} onClick={() => window.location.replace(`/recipes?page=${i}&limit=${utils.limit}`)}>
          {i}
        </button>
      );
    }

    return btn;
  }

  const handleSorting = (e) => {
    setUtils((prev) => {
      return {
        ...prev,
        sort: e.target.value,
      };
    });
  };

  return (
    <MainLayout>
      <div className={`${style.mainRow} pt-5 row`}>
        <div className="col-12">
          <div className="container">
            <h1 className={`mb-4 pt-4 ${pathname == '/recipes' ? 'text-light' : ''}`}>Daftar Recipe</h1>

            <div className="row">
              <div className="col-12 mb-3">
                <div className="row">
                  <div className="col-7 col-md-4">
                    <select className="form-select" name="sort" onChange={handleSorting} aria-label="Default select example">
                      <option value="desc">Newest</option>
                      <option value="asc">Oldest</option>
                    </select>
                  </div>
                </div>
              </div>

              {
                (isLoading ? showLoading() : Swal.close(),
                recipes?.data?.map((recipe) => (
                  <div key={recipe.id} className="col-6 col-md-3 mt-3">
                    <CardRecipe item={recipe} />
                  </div>
                )))
              }

              <div className="pagination d-flex justify-content-center mt-4 gap-3 mb-3">
                <button className="prev-btn btn btn-secondary" onClick={() => window.location.replace(`/recipes?page=${utils?.page - 1}&limit=${utils.limit}`)} disabled={utils?.page == 1}>
                  Prev
                </button>
                <span className="d-flex">{isLoading ? 'Loading....' : generatePagination().map((page, i) => i < 5 && page)}</span>
                <button className="prev-btn btn btn-warning text-light" onClick={() => window.location.replace(`/recipes?page=${Number(utils?.page) + 1}&limit=${utils.limit}`)} disabled={utils?.page == recipes?.pagination?.totalPage}>
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Recipes;
