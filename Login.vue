<template>
    <section class="vh-100" style="background-color: hsl(0, 0%, 93%);">
        <div class="mask d-flex align-items-center h-100">
        <div class="container h-100">
            <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="col-12 cl-md-9 col-lg-7 col-xl-6">
                <div class="card" style="border-radius: 5px;">
                    <div class="card-body p-4">
                        <h2 class="text-uppercase text-center mb-5">Welcome Back</h2>
                        <form action="#">
                           <div class="form-outline mb-4">
                            <label for="email" class="form-label">Email</label>
                            <input type="email" class="form-control form-control-lg" id="email" v-model="email"/>
                           </div>                           <div class="form-outline mb-4">
                            <label for="fname" class="form-label">Password</label>
                            <input type="password" class="form-control form-control-lg" id="psw" v-model="psw"/>
                           </div>
                           <div class="d-flex justify-content-center">
                            <input type="button" class="btn btn-success btn-block btn-lg gradient-custom-4 text-body w-100" value="Login" @click="handleLogin">
                           </div>
                            <!-- <router-link to="/">Home</router-link> -->
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
                return{
                    email: '',
                    psw: ''
                }
            },
            methods: {
                async handleLogin(){
                    try{
                        const url = "http://localhost:5000/hbca/login"
                        // url to handle post request wih our payload
                        const response = await fetch(url, {
                        method: 'POST', 
                        headers: {
                            'Content-Type':'application/json'
                        }, 

                        body: JSON.stringify({
                           email: this.email,
                           psw: this.psw
                        }),
                        
                        mode: "cors"
                    });

                    const data = await response.json()
                    console.log(data);

                    }catch(e){
                        console.error("error: ", e)
                    }
                }
            }
        }
</script>   