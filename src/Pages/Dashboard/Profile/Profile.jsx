import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import profile from '../../../assets/Profile/avatar.png';
import SecondaryFooter from '../../../Components/Footer/SecondaryFooter';
import Navbar from '../../../Components/Navbar/Navbar';
import Card from '../../../Components/Profile/Card';
import style from './style.module.css';
import img from '../../../assets/Profile/img1.png';
import img2 from '../../../assets/Profile/img2.png';
import { useGetAllRecipeQuery, useDeleteRecipeByIdMutation, useGetRecipeByIdQuery } from '../../../Features/recipe/recipeApi';
import { useGetUserDetailQuery, useUpdateUserByIdMutation } from '../../../Features/user/userApi';
import ModalEditProfile from '../../../Components/Profile/ModalEditProfile';
import { useCreateLikedRecipeMutation } from '../../../Features/likedRecipe/likedRecipeApi';
import { useCreateSavedRecipeMutation } from '../../../Features/savedRecipe/savedRecipe';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';

const Profile = () => {
  const { data: user, isLoading, isSuccess } = useGetUserDetailQuery(localStorage.getItem('id_user'));
  const [updateUserById, { isSuccess: isSuccessUpdate }] = useUpdateUserByIdMutation();
  const [dataRow, setDataRow] = useState('my-recipe');
  const [deleteRecipeById, { error: errorDeleteRecipeById, isLoading: isLoadingdeleteRecipeById }] = useDeleteRecipeByIdMutation();
  const [createLikedRecipe, { isLoading: isLoadingDeleteLiked, error: errorDeleteLikedRecipe }] = useCreateLikedRecipeMutation();
  const [createSavedRecipe, { isLoading: isLoadingSavedRecipe, error: errorSavedRecipe }] = useCreateSavedRecipeMutation();
  const dispatch = useDispatch();

  const deleteRecipeHandler = async (id) => {
    Swal.fire({
      title: 'Sure to Delete This Recipe ?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch(deleteRecipeById(id));
      }
    });
  };

  const deleteLikedRecipeHandler = async (id) => {
    Swal.fire({
      title: 'Sure to Delete from Liked Recipe ?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await createLikedRecipe({ id_recipe: id });
      }
    });
  };

  const deleteSavedRecipeHandler = async (id) => {
    Swal.fire({
      title: 'Sure to Delete from Saved Recipe ?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await createSavedRecipe({ id_recipe: id });
      }
    });
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-5 mb-2 min-vh-100">
        <div className="row">
          <div className="profil text-center py-5">
            <div className="d-flex justify-content-center">
              {/* <img className="rounded-circle mb-1 ms-5" width={95} height={90} src={profile} alt="img" /> */}
              <img className="rounded-circle mb-1 ms-5" width={95} height={90} src={user?.photo} alt="" />
              {!isLoading && <ModalEditProfile id={user.id} />}
            </div>
            <h3>{user?.name}</h3>
          </div>

          <div className="text-secondary">
            <ul className="list-inline mt-3 sm-4">
              <li className="list-inline-item mx-3" onClick={() => setDataRow('my-recipe')}>
                <Link className={`list-link ${dataRow == 'my-recipe' ? 'text-dark fw-semibold' : ''} ${style.listProfil}`} to="#">
                  My Recipe
                </Link>
              </li>
              <li className="list-inline-item mx-2" onClick={() => setDataRow('saved')}>
                <Link className={`list-link ${dataRow == 'saved' ? 'text-dark fw-semibold' : ''} ${style.listProfil}`} to="#">
                  Saved Recipe
                </Link>
              </li>
              <li className="list-inline-item mx-3" onClick={() => setDataRow('likes')}>
                <Link className={`list-link ${dataRow == 'likes' ? 'text-dark fw-semibold' : ''} ${style.listProfil}`} to="#">
                  Liked Recipe
                </Link>
              </li>
            </ul>
          </div>
          <div className="row mx-auto justfy-content-between">
            {isLoading
              ? 'Loading...'
              : dataRow == 'my-recipe'
              ? user?.recipes?.map((recipe, i) => (
                  <div key={i} className="col-6 px-1 col-sm-4 col-md-3 mb-2">
                    <Card type={'my-recipe'} item={recipe} ondelete={(id) => deleteRecipeHandler(id)} />
                  </div>
                ))
              : dataRow == 'saved'
              ? user?.saved?.map((recipe, i) => (
                  <div key={i} className="col-6 px-1 col-sm-4 col-md-3 mb-2">
                    <Card item={recipe} ondelete={(id) => deleteSavedRecipeHandler(id)} />
                  </div>
                ))
              : user?.likes?.map((recipe, i) => (
                  <div key={i} className="col-6 px-1 col-sm-4 col-md-3 mb-2">
                    <Card item={recipe} ondelete={(id) => deleteLikedRecipeHandler(id)} />
                  </div>
                ))}
          </div>
        </div>
      </div>
      <SecondaryFooter />
    </div>
  );
};

export default Profile;
