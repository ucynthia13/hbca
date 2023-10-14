<template>
    <section class="vh-100" style="background-color: hsl(0, 0%, 93%);">
        <div class="mask d-flex align-items-center h-100">
        <div class="container h-100">
            <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="col-12 cl-md-9 col-lg-7 col-xl-6">
                <div class="card" style="border-radius: 5px;">
                    <div class="card-body p-4">
                        <h2 class="text-uppercase text-center mb-5">Create your account</h2>
                        <form action="#">
                           <div class="form-outline mb-4">
                            <label for="fname" class="form-label">Firstname</label>
                            <input type="text" class="form-control form-control-lg" id="fname" v-model="formData.fname"/>
                           </div>
                           <div class="form-outline mb-4">
                            <label for="fname" class="form-label">Lastname</label>
                            <input type="text" class="form-control form-control-lg" id="lname" v-model="formData.lname" />
                           </div>
                           <div class="form-outline mb-4">
                            <label for="fname" class="form-label">Email</label>
                            <input type="email" class="form-control form-control-lg" id="email" v-model="formData.email" />
                           </div>                           <div class="form-outline mb-4">
                            <label for="fname" class="form-label">Password</label>
                            <input type="password" class="form-control form-control-lg" id="psw" v-model="formData.psw" />
                           </div>
                           <div class="form-check d-flex justify-content-center mb-4">
                            <input type="checkbox" class="form-check-input me-2" id="fcheck" v-model="formData.fcheck"/>
                            <label class="form-check-label" for="fcheck">
                                I agree all statements in <a href="#!" class="text-body"><u>Terms of service</u></a>
                            </label>
                           </div>
                           <div class="d-flex justify-content-center">
                            <input type="button" class="btn btn-success btn-block btn-lg gradient-custom-4 text-body w-100" value="Register" id="register" @click="handleSubmit">
                            <!-- <button type="button" class="btn btn-success btn-block btn-lg gradient-custom-4 text-body">Register</button> -->
                           </div>
                           <p class="text-center text-muted mt-5 mb-0">Have already an account? <a href="#!"
                            class="fw-bold text-body"><u>Login Here</u></a></p>
                            
                        </form>
                    </div>
                </div>
            </div>
        </div>
        </div>
    </div>
    </section>

  </template>

<style scoped>
    .gradient-custom-4 {
        border: none;
        background: linear-gradient(to right, rgba(132, 250, 176, 1), rgba(143, 211, 244, 1))
    }
</style>

<script defer>
    export default{
        data(){
            // if(psw == rpsw){
                
            // }
            return{
                formData: {
                    fname: '',
                    lname: '',
                    email: '',
                    psw: '',
                    rpsw: '', 
                    fcheck: ''
                }
                
            }
        }, 
        methods: {
            async handleSubmit(){
               try{
                const url = "http://localhost:5000/api/signup"
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.formData),
                    mode: "cors"
                });
                
                const data = await response.json()
                console.log(data);
               } catch (error){
                    console.log('error: ', error);
               }
                
            }
            
        }
    }


</script>