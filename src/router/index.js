import Vue from 'vue';
import VueRouter from 'vue-router';
import home from '../components/home.vue';
import homepage from '../components/homepage.vue';
import self from '../components/self.vue';
import help from '../components/help.vue';
import dingding from '../components/dingding.vue';
import helpadd from '../components/helpadd.vue';
import helpreply from '../components/helpreply.vue';
import issue from '../components/issue.vue'
import other from '../components/other.vue'
import myhelp from '../components/myhelp.vue'
import survey from '../components/survey.vue'
import survey_h from '../components/survey_h.vue'
import article_comment from '../view/article-component/article_comment'

Vue.use(VueRouter);

const routes = [
    { path: '/', redirect: '/home' },
    { path: '/dingding', component: dingding },
    { path: '/issue', component: issue },
    { path: '/other', component: other, name: 'other' },
    { path: '/article_comment', component: article_comment },
    {
        // redirect: '/home',
        path: '/home',
        component: home,
        redirect: '/homepage',
        children: [
            { path: '/help', component: help },
            { path: '/helpadd', component: helpadd },
            { path: '/helpreply', component: helpreply },
            { path: '/self', component: self },
            { path: '/myhelp', component: myhelp },
            { path: '/survey', component: survey },
            { path: '/survey_h', component: survey_h },
            { path: '/homepage', component: homepage },
        ],
    },
];



const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

export default router;