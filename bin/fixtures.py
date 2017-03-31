import os, sys

sys.path.append(
    os.path.abspath(os.path.dirname(__file__) + '/..')
)


from datetime import datetime

from user.models import User
from trips.models import UserLocation
from blog.models import Article


john = User(
    email='john@doe.com',
    username='John Doe',
    about='Nomad fries lover traveling the world to taste them.',
).set_password('johndoe')
john.locations = [
    UserLocation(position=[1.1, 1.1], date=datetime(2017, 1, 1), duration=5000),
    UserLocation(position=[1.2, 1.2], date=datetime(2017, 1, 7), duration=10000),
    UserLocation(position=[1.5, 2], date=datetime(2017, 1, 20), duration=20000),
    UserLocation(position=[3, 40], date=datetime(2017, 2, 1), duration=15000),
]
john.save()


article = Article(
    author=john,
    title="Why Do French Fries Taste So Bad When They're Cold?",
    content='''<p>Grainy, flavorless, rigid, yet soggy &mdash; is there anything worse than an old, cold french fry?</p><p>But how does a warm, golden, crispy and all-around perfect french fry go from a delicious <a href="http://www.livescience.com/14890-marijuana-chemicals-fatty-foods.html">food that you can&#39;t stop eating</a> to a food that you can&#39;t get away from fast enough?</p><p>One of the main reasons that french fries lose their appeal when cold is that their texture changes, said Matt Hartings, an assistant professor of chemistry at American University in Washington, D.C. [<a href="http://www.livescience.com/56214-does-salt-make-water-boil-faster.html">Does Salt Make Water Boil Faster?</a>]</p><p>That change in texture can be explained by the chemistry of <a href="http://www.livescience.com/54775-potatoes-high-blood-pressure.html">potatoes</a>, Hartings told Live Science. Potatoes are filled with starch, Hartings said. <a href="http://www.livescience.com/36497-fast-starch-food-obesity.html">Starches taste good</a> when they are &quot;hydrated,&quot; he said.</p><p>Think of the starches in potatoes as tiny crystal spheres, Hartings said. At really high temperatures (like in fryers), water will go into those spheres and fill them up like balloons, he said. Instead of a small, hard sphere, you end up with something more &quot;poofy,&quot; he said.</p><p>And this &quot;poofy&quot; texture is something people really like, Hartings said.</p><p>But as fries cool down, the water starts to move out of the crystals, and you lose the fluffy texture, Hartings said. The spheres become more crystalline and gritty, he said.</p><p>And where does the water go when it leaves the starchy spheres? Right into the crust of the fry, Hartings said. That turns the crispy crust that came out of the fryer into a soggy mess.</p><p>Temperature also partially explains why the taste of fries changes as they cool down, Hartings said. Simply put, heat can heighten the flavors in foods, he said. Consider how different your morning coffee tastes when it gets cold, he added.</p><p>Finally, <a href="http://www.livescience.com/2737-surprising-impact-taste-smell.html">smell plays a big role in how a food tastes</a>, Hartings said. Fresh french fries have a great aroma, but when they&#39;re cold, the smell is largely gone, he said. Without that smell, a lot of the flavor disappears, he said.&nbsp;</p>'''
)
article.save()
