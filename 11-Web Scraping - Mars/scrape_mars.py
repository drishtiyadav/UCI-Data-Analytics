# importing dependencies
from splinter import Browser
from bs4 import BeautifulSoup
import pandas as pd

def init_browser():
    executable_path = {'executable_path': 'c:/data/chromedriver.exe'}
    return Browser('chrome', **executable_path, headless=False)


def scrape():

    # initiate the browser for scraping
    browser = init_browser()

    # Dictionary to store all the scraped information and return 
    scraped_data = {}

    # ## Scraping NASA Mars News  

    news_url = 'https://mars.nasa.gov/news/'
    browser.visit(news_url)

    html = browser.html
    soup = BeautifulSoup(html, 'html.parser')

    # Find the news title and paragraph
    article= soup.find('li', class_='slide')
    try:

        news_title_section = article.find('div', class_='content_title')
        news_title = news_title_section.a.text

        news_para_section = article.find('div', class_='article_teaser_body')
        news_para = news_para_section.text

        if(news_title and news_para):
            scraped_data['mars_news_title'] = news_title
            scraped_data['mars_news_paragraph'] = news_para 
    except AttributeError as e:
        print(e)
    

    # ## Scraping JPL Mars Space Images to find Featured Image

    image_url = 'https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars'
    browser.visit(image_url)

    # Go to 'Full Image' page
    browser.click_link_by_partial_text('FULL IMAGE')
    html = browser.html
    soup = BeautifulSoup(html, 'html.parser')
    # Find the image large/wallpaper size
    slide = soup.find('div', class_="carousel_items")
    image = slide.article['style']
    img_list = image.split("'")
    featured_img_url = 'https://www.jpl.nasa.gov' + img_list[1]
    # save the scraped information
    scraped_data['mars_image'] = featured_img_url

    # ## Mars Weather

    weather_url = 'https://twitter.com/marswxreport?lang=en'
    browser.visit(weather_url)

    html = browser.html
    soup = BeautifulSoup(html, 'html.parser')
    # Find the weather tweet 
    mars_weather = soup.find('p', class_="tweet-text").text
    # save the scraped information
    scraped_data['mars_weather'] = mars_weather

    # ## Mars Facts

    facts_url = 'http://space-facts.com/mars/'

    tables = pd.read_html(facts_url)
    facts = tables[0].to_html(header=False, index=False)
    # save the scraped information
    scraped_data['mars_facts'] = facts

    # ## Mars Hemispheres

    h_image_urls = []
    hemisphere_names = []
    hemisphere_images = []

    hemispheres_url = 'https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars'
    browser.visit(hemispheres_url)
    html = browser.html
    soup = BeautifulSoup(html, 'html.parser')

    items = soup.find_all('div', class_="item")

    for item in items:
        item_url = item.a['href']
        full_url = 'https://astrogeology.usgs.gov' + item_url
        h_image_urls.append(full_url)
        
        item_desc = item.div.a.text[:-9]
        hemisphere_names.append(item_desc)
        
    # loop for browsing through the image urls  
    for img_url in h_image_urls:
        
        browser.visit(img_url)
        html = browser.html
        soup = BeautifulSoup(html, 'html.parser')
        
        sample_img = soup.find('img', class_='wide-image')
        img = "https://astrogeology.usgs.gov" + sample_img['src']
        hemisphere_images.append(img)
    # save the scraped information
    scraped_data['mars_hemisphere_names'] = hemisphere_names
    scraped_data['mars_hemisphere_images'] = hemisphere_images
    browser.quit()

    return scraped_data

    
